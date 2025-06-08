import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import db from "../../config";
import { FullUser, User, UserRequest } from "../../interfaces";
import { hash } from "../../middleware/general";
import { createSendToken } from "../../utils/jwt";
import Email from "../../utils/mail";
import { generateOtp } from "../../utils/otp";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, uuid } = req.body;
  const mail = email.trim();
  let newUser: Partial<FullUser>;

  try {
    if (uuid === "giveback") {
      newUser = {
        email: mail,
        password: uuid,
        status: 1,
        active: 1,
        token: 0,
      };
    } else if (uuid === "donor" || uuid === "google-donor") {
      newUser = {
        email: mail,
        password: hash(password.trim()),
        role: "donor",
        active: 1,
        token: generateOtp(6),
      };
    } else if (uuid === "corporate") {
      if (!password) {
        res
          .status(400)
          .json({ error: "Password is required for corporate role" });
        return;
      }
      newUser = {
        email: mail,
        password: hash(password.trim()),
        role: "corporate",
        active: 1,
        token: generateOtp(6),
      };
    } else {
      newUser = {
        email: mail,
        password: hash(password.trim()),
        active: 1,
        token: generateOtp(6),
      };
    }

    const [id] = await db("users").insert(newUser);
    const user = await db("users").where({ id }).first();

    if (uuid !== "giveback" && uuid !== "google-donor") {
      const token = newUser.token ?? 0;
      const url = "";
      const additionalData = { subject: "Welcome to the GivingBack Family!" };
      await new Email({ email: mail, url, token, additionalData }).sendEmail(
        "otp",
        "Welcome to the GivingBack Family!"
      );
    }

    createSendToken(user, 200, req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while signing up" });
  }
};

export const verify = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const otp = Number(req.body.otp);
  const id = (req.user as User)?.id;
  const user = await db("users").where({ id }).first();

  if (otp === user?.token) {
    await db("users").update({ status: 1, token: 0 }).where({ id });

    res.status(200).json("Email Verified");
    return;
  } else {
    res.status(400).json({ error: "Invalid OTP" });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password: rawPassword, uuid } = req.body;

  const user = await db("users").where({ email }).first();
  if (!user) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  if (user.active === 0) {
    res.status(400).json({
      error: "Your account has been deactivated, Please contact Admin",
    });
    return;
  }

  if (uuid === "giveback") {
    return createSendToken(user, 200, req, res);
  }

  const passwordIsValid =
    rawPassword && (await bcrypt.compare(rawPassword, user.password));
  if (!passwordIsValid) {
    res.status(400).json({ error: "Invalid Login Credentials" });
    return;
  }

  createSendToken(user, 200, req, res);
};

export const logout = (req: Request, res: Response) => {
  res.cookie("giveback", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
export const onboard = async (req: Request, res: Response) => {
  const {
    selectedOption,
    email,
    password,
    category,
    country,
    state,
    userType,
    cpassword,
    name,
    interest_area,
    orgemail,
    orgphone,
    phone,
    cac,
  } = req.body;

  const mail = email.trim();
  const token = generateOtp(6); // generate token ONCE and reuse

  try {
    // === Validate required file ===
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: "fail",
        error: `No userimg files uploaded.`,
      });
    }

    const filesToProcess = Array.isArray(req.files)
      ? req.files.filter((file) => file.fieldname === "userimg")
      : [];

    if (filesToProcess.length === 0) {
      return res.status(400).json({
        status: "fail",
        error: `No userimg files uploaded.`,
      });
    }

    // === Create user ===
    let newUser: Partial<FullUser>;
    if (selectedOption === "organization") {
      newUser = {
        email: mail,
        password: hash(password.trim()),
        role: "NGO",
        active: 1,
        token,
      };
    } else {
      newUser = {
        email: mail,
        password: hash(password.trim()),
        role: userType === "individual" ? "donor" : "corporate",
        active: 1,
        token,
      };
    }

    // === Insert user ===
    const [userRow] = await db("users")
      .insert(newUser)
      .returning(["id", "email", "role", "active", "token"]); // Return full row

    const userId = userRow;
    const user = await db("users").where({ id: userId }).first();

    const additionalData = {
      subject: "Welcome to the GivingBack Family!",
      role: "User",
    };

    // === Insert org or donor ===
    if (selectedOption === "organization") {
      const newOrg = {
        name: name?.trim(),
        phone: phone?.trim(),
        interest_area: interest_area?.trim(),
        cac: cac?.trim(),
        user_id: userId,
      };

      const [orgRow] = await db("organizations").insert(newOrg).returning("id");

      const address = {
        state: state?.trim(),
        user_id: userId,
      };

      await db("address").insert(address);

      await new Email({
        email: mail,
        url: "",
        token,
        additionalData,
      }).sendEmail("ngoonb", "Welcome to the GivingBack Family!");
    } else {
      const additionalFields = {
        orgemail: orgemail?.trim(),
        orgphone: orgphone?.trim(),
      };

      await db("donors").insert({
        name: name?.trim(),
        phoneNumber: phone?.trim(),
        email: mail,
        interest_area: interest_area?.trim(),
        state: state?.trim(),
        user_id: userId,
        additional_information: JSON.stringify(additionalFields),
      });

      await new Email({
        email: mail,
        url: "",
        token,
        additionalData,
      }).sendEmail("donoronboard", "Welcome to the GivingBack Family!");
    }

    await new Email({
      email: "info@givingbackng.org",
      url: "",
      token,
      additionalData,
    }).sendEmail("adminonb", "New User");

    // === Upload files ===
    await Promise.all(
      filesToProcess.map(async (file: any) => {
        const doc = {
          filename: file.location,
          user_id: userId,
        };
        await db("userimg").insert(doc);
      })
    );

    // === Send final token ===
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.error("Onboard Error:", error);
    res.status(500).json({ error: "An error occurred while signing up" });
  }
};

export const resend = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const userId = (req.user as User)?.id;
  const user = await db("users").where({ id: userId }).first();

  if (user) {
    const newToken = generateOtp(6);
    await db("users").where({ id: userId }).update({ token: newToken });
    const userEmail = user.email;
    const url = "";
    await new Email({ email: userEmail, url, token: newToken }).sendEmail(
      "welcome",
      "Welcome to the GivingBack Family!"
    );

    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ status: "error", error: "User not found" });
  }
};

// Utility functions remain unchanged

const getBank = async (userId: number) => {
  return await db("banks")
    .where({ user_id: userId })
    .select("bankName", "accountName", "accountNumber", "bvn");
};

const getAddress = async (userId: number) => {
  return await db("address")
    .where({ user_id: userId })
    .select("state", "city_lga", "address");
};

const getOrCreateWallet = async (userId: number) => {
  let wallet = await db("wallet").where({ user_id: userId }).first();

  if (!wallet) {
    await db("wallet").insert({
      user_id: userId,
      balance: 0.0,
      currency: "NGN",
    });
    wallet = await db("wallet").where({ user_id: userId }).first();
  }

  return wallet;
};

const getUserImage = async (userId: number) => {
  const userImage = await db("userimg").where({ user_id: userId }).first();
  return userImage || null;
};

async function getTotalProjectsCount(userId: number) {
  const totalProjectsCount: any = await db("project")
    .where({ organization_id: userId })
    .count("id as totalCount")
    .first();
  return totalProjectsCount.totalCount || 0;
}

async function getActiveProjectsCount(userId: number) {
  const activeProjectsCount: any = await db("project")
    .where({ organization_id: userId, status: "active" })
    .count("id as activeCount")
    .first();

  return activeProjectsCount.activeCount || 0;
}

async function getDonationsCount(userId: number) {
  const donationsCount: any = await db("donations")
    .where({ ngo_id: userId })
    .count("donations.id as donationCount")
    .first();

  return donationsCount.donationCount || 0;
}

export const getOne = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const id = (req.user as User)?.id;
  let user = await db("organizations")
    .where({ user_id: id })
    .select("id", "name", "phone", "website", "interest_area", "cac", "active")
    .first();

  if (!user) {
    user = await db("donors")
      .where({ user_id: id })
      .select(
        "id",
        "name",
        "phoneNumber",
        "industry",
        "email",
        "interest_area",
        "state",
        "city_lga",
        "address",
        "about",
        "image",
        "additional_information"
      )
      .first();

    const userImage = await getUserImage(id);
    const wallet = await getOrCreateWallet(id);

    if (!user) {
      res.status(404).json({ error: "User not associated with any account" });
      return;
    }

    res.status(200).json({ user, userImage, wallet });
    return;
  }

  const bank = await getBank(id);
  const address = await getAddress(id);
  const userImage = await getUserImage(id);
  const allProjectsCount = await getTotalProjectsCount(id);
  const activeProjectsCount = await getActiveProjectsCount(id);
  const donationsCount = await getDonationsCount(id);
  const wallet = await getOrCreateWallet(id);

  res.status(200).json({
    user,
    bank,
    address,
    userImage,
    allProjectsCount,
    activeProjectsCount,
    donationsCount,
    wallet,
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  const token = generateOtp(9);
  const encodedToken = Buffer.from(token.toString()).toString("base64");

  const user = await db("users").update({ token }).where({ email });

  if (!user) {
    res
      .status(404)
      .json({ error: "There is no user associated with this email address" });
    return;
  }

  const url = `https://givebackng.org/auth/resetPassword/${encodedToken}`;
  await new Email({ email, url, token }).sendEmail(
    "passwordReset",
    "Your password reset token"
  );

  res.status(200).json({ status: "success", message: "Token sent to email!" });
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;

  const password = hash(newPassword.trim());

  const numericToken = Number(token);

  const user = await db("users")
    .update({ password, token: 0 })
    .where({ token: numericToken });

  if (!user) {
    res.status(400).json({ error: "Token is invalid" });
    return;
  }

  res.status(200).json({ message: "Password successfully changed" });
};

export const deactivate = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  await db("users")
    .update({ active: 0 })
    .where({ id: (req.user as User)?.id });
  res.status(200).json({ status: "success" });
};

export const changePassword = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const { oldPassword, newPassword } = req.body;

  const user = await db("users")
    .where({ id: (req.user as User)?.id })
    .first();

  if (!user) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
  if (!passwordIsValid) {
    res.status(400).json({ error: "Old password is incorrect" });
    return;
  }

  (user.password = hash(newPassword.trim())),
    await db("users")
      .where({ id: user.id })
      .update({ password: user.password });

  res.status(200).json({
    status: "success",
    message: "Password has been changed successfully!",
  });
  return;
};
