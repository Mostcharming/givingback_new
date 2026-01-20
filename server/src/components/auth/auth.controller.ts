import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import xlsx from "xlsx";
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
  try {
    const otp = Number(req.body.otp);
    const user = await db("users").where({ token: otp }).first();

    if (!user) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    if (otp === user.token) {
      await db("users").update({ status: 1, token: 0 }).where({ id: user.id });

      res.status(200).json({ message: "Email Verified" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  const token = generateOtp(6);

  try {
    const filesToProcess = Array.isArray(req.files)
      ? req.files.filter((file) => file.fieldname === "userimg")
      : [];

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

    const [userRow] = await db("users")
      .insert(newUser)
      .returning(["id", "email", "role", "active", "token"]);

    const userId = userRow;
    const user = await db("users").where({ id: userId }).first();

    const additionalData = {
      subject: "Welcome to the GivingBack Family!",
      role: "User",
    };

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
      }).sendEmail("otp", "Welcome to the GivingBack Family!");
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
    }
    if (filesToProcess.length > 0) {
      await Promise.all(
        filesToProcess.map(async (file: any) => {
          const doc = {
            filename: file.location,
            user_id: userId,
          };
          await db("userimg").insert(doc);
        })
      );
    }

    await new Email({
      email: mail,
      url: "",
      token,
      additionalData,
    }).sendEmail("otp", "Welcome to the GivingBack Family!");

    await new Email({
      email: "info@givingbackng.org",
      url: "",
      token,
      additionalData,
    }).sendEmail("adminonb", "New User");
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.error("Onboard Error:", error);
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

const getBank = async (userId: number) => {
  return await db("banks")
    .where({ user_id: userId })
    .select("id", "bankName", "accountName", "accountNumber", "bvn");
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
    const bank = await getBank(id);
    const wallet = await getOrCreateWallet(id);

    if (!user) {
      res.status(404).json({ error: "User not associated with any account" });
      return;
    }

    res.status(200).json({ user, userImage, wallet, bank });
    return;
  }

  const bank = await getBank(id);
  const address = await getAddress(id);
  const userImage = await getUserImage(id);
  const allProjectsCount = await getTotalProjectsCount(user.id);
  const activeProjectsCount = await getActiveProjectsCount(user.id);
  const donationsCount = await getDonationsCount(user.id);
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
  res.status(200).json({ status: "success", message: "Token sent to email!" });

  const url = `https://givebackng.org/auth/resetPassword/${encodedToken}`;
  await new Email({ email, url, token }).sendEmail(
    "passwordReset",
    "Your password reset token"
  );
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

  if (!oldPassword || typeof oldPassword !== "string") {
    res.status(400).json({ error: "Old password is required" });
    return;
  }

  if (!user.password) {
    res.status(400).json({ error: "No existing password for this user" });
    return;
  }

  if (!newPassword || typeof newPassword !== "string") {
    res.status(400).json({ error: "New password is required" });
    return;
  }

  const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
  if (!passwordIsValid) {
    res.status(400).json({ error: "Old password is incorrect" });
    return;
  }

  user.password = hash(newPassword.trim());
  await db("users").where({ id: user.id }).update({ password: user.password });

  res.status(200).json({
    status: "success",
    message: "Password has been changed successfully!",
  });
  return;
};

export const updateOne = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const id = (req.user as User)?.id;
  const {
    name,
    phone,
    phoneNumber,
    email,
    website,
    interest_area,
    cac,
    industry,
    state,
    city_lga,
    address,
    about,
    orgemail,
    orgphone,
    additional_information,
    bankName,
    accountName,
    accountNumber,
    bvn,
  } = req.body;

  try {
    const filesToProcess = Array.isArray(req.files)
      ? req.files.filter((file: any) => file.fieldname === "userimg")
      : [];

    if (filesToProcess.length > 0) {
      await db("userimg").where({ user_id: id }).del();

      await Promise.all(
        filesToProcess.map(async (file: any) => {
          const doc = {
            filename: file.location,
            user_id: id,
          };
          await db("userimg").insert(doc);
        })
      );
    }

    let orgUser = await db("organizations").where({ user_id: id }).first();

    if (orgUser) {
      const updateData: any = {};

      if (name !== undefined) updateData.name = name?.trim();
      if (phone !== undefined) updateData.phone = phone?.trim();
      if (website !== undefined) updateData.website = website?.trim();
      if (interest_area !== undefined)
        updateData.interest_area = interest_area?.trim();
      if (cac !== undefined) updateData.cac = cac?.trim();

      if (Object.keys(updateData).length > 0) {
        await db("organizations").where({ user_id: id }).update(updateData);
      }

      const addressData: any = {};
      if (state !== undefined) addressData.state = state?.trim();
      if (city_lga !== undefined) addressData.city_lga = city_lga?.trim();
      if (address !== undefined) addressData.address = address?.trim();

      if (Object.keys(addressData).length > 0) {
        const existingAddress = await db("address")
          .where({ user_id: id })
          .first();

        if (existingAddress) {
          await db("address").where({ user_id: id }).update(addressData);
        } else {
          addressData.user_id = id;
          await db("address").insert(addressData);
        }
      }

      const bankData: any = {};
      if (bankName !== undefined) bankData.bankName = bankName?.trim();
      if (accountName !== undefined) bankData.accountName = accountName?.trim();
      if (accountNumber !== undefined)
        bankData.accountNumber = accountNumber?.trim();
      if (bvn !== undefined) bankData.bvn = bvn?.trim();

      if (Object.keys(bankData).length > 0) {
        bankData.user_id = id;
        await db("banks").insert(bankData);
      }

      const updatedOrg = await db("organizations")
        .where({ user_id: id })
        .select(
          "id",
          "name",
          "phone",
          "website",
          "interest_area",
          "cac",
          "active"
        )
        .first();

      const bank = await getBank(id);
      const address_data = await getAddress(id);
      const userImage = await getUserImage(id);
      const allProjectsCount = await getTotalProjectsCount(updatedOrg.id);
      const activeProjectsCount = await getActiveProjectsCount(updatedOrg.id);
      const donationsCount = await getDonationsCount(updatedOrg.id);
      const wallet = await getOrCreateWallet(id);

      res.status(200).json({
        message: "Organization details updated successfully",
        user: updatedOrg,
        bank,
        address: address_data,
        userImage,
        allProjectsCount,
        activeProjectsCount,
        donationsCount,
        wallet,
      });
      return;
    }

    let donorUser = await db("donors").where({ user_id: id }).first();

    if (donorUser) {
      const updateData: any = {};

      if (name !== undefined) updateData.name = name?.trim();
      if (phoneNumber !== undefined)
        updateData.phoneNumber = phoneNumber?.trim();
      if (email !== undefined) updateData.email = email?.trim();
      if (industry !== undefined) updateData.industry = industry?.trim();
      if (interest_area !== undefined)
        updateData.interest_area = interest_area?.trim();
      if (state !== undefined) updateData.state = state?.trim();
      if (city_lga !== undefined) updateData.city_lga = city_lga?.trim();
      if (address !== undefined) updateData.address = address?.trim();
      if (about !== undefined) updateData.about = about?.trim();
      if (additional_information !== undefined) {
        updateData.additional_information = JSON.stringify({
          orgemail: orgemail?.trim(),
          orgphone: orgphone?.trim(),
        });
      }

      if (Object.keys(updateData).length > 0) {
        await db("donors").where({ user_id: id }).update(updateData);
      }

      const addressData: any = {};
      if (state !== undefined) addressData.state = state?.trim();
      if (city_lga !== undefined) addressData.city_lga = city_lga?.trim();
      if (address !== undefined) addressData.address = address?.trim();

      if (Object.keys(addressData).length > 0) {
        const existingAddress = await db("address")
          .where({ user_id: id })
          .first();

        if (existingAddress) {
          await db("address").where({ user_id: id }).update(addressData);
        } else {
          addressData.user_id = id;
          await db("address").insert(addressData);
        }
      }

      const bankData: any = {};
      if (bankName !== undefined) bankData.bankName = bankName?.trim();
      if (accountName !== undefined) bankData.accountName = accountName?.trim();
      if (accountNumber !== undefined)
        bankData.accountNumber = accountNumber?.trim();
      if (bvn !== undefined) bankData.bvn = bvn?.trim();

      if (Object.keys(bankData).length > 0) {
        bankData.user_id = id;
        await db("banks").insert(bankData);
      }

      const updatedDonor = await db("donors")
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

      const bank = await getBank(id);
      const address_data = await getAddress(id);
      const userImage = await getUserImage(id);
      const wallet = await getOrCreateWallet(id);

      res.status(200).json({
        message: "Donor details updated successfully",
        user: updatedDonor,
        bank,
        address: address_data,
        userImage,
        wallet,
      });
      return;
    }

    res.status(404).json({ error: "User not associated with any account" });
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user details" });
  }
};

export const getOrganizationCounts = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;

    if (!userId) {
      res.status(400).json({ error: "User ID not found" });
      return;
    }

    const donor = await db("donors").where({ user_id: userId }).first();

    if (!donor) {
      res.status(404).json({ error: "Donor not found" });
      return;
    }

    const donorId = donor.id;

    const totalOrganizationsResult: any = await db("organizations")
      .count("id as totalCount")
      .first();

    const totalOrganizations = totalOrganizationsResult?.totalCount || 0;

    const donorOrganizationsResult: any = await db("organizations")
      .where({
        donor_id: donorId,
      })
      .count("id as donorOrgCount")
      .first();

    const donorOrganizationCount = donorOrganizationsResult?.donorOrgCount || 0;

    const verifiedOrganizationsResult: any = await db("organizations")
      .where({ is_verified: 1 })
      .count("id as verifiedCount")
      .first();

    const verifiedOrganizationsCount =
      verifiedOrganizationsResult?.verifiedCount || 0;

    res.status(200).json({
      totalOrganizations,
      donorOrganizationCount,
      verifiedOrganizationsCount,
    });
  } catch (error) {
    console.error("Get Organization Counts Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching organization counts" });
  }
};

export const deleteBank = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const userId = (req.user as User)?.id;
  const { id } = req.params;

  try {
    const bank = await db("banks").where({ id, user_id: userId }).first();

    if (!bank) {
      res.status(404).json({ error: "Bank account not found" });
      return;
    }

    await db("banks").where({ id, user_id: userId }).del();

    res.status(200).json({
      status: "success",
      message: "Bank account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Bank Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting bank account" });
  }
};

export const getAllOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { is_verified, donor_id } = req.query;

    let query = db("organizations")
      .leftJoin("users", "organizations.user_id", "users.id")
      .select("organizations.*", "users.email");

    if (is_verified !== undefined) {
      query = query.where({ "organizations.is_verified": Number(is_verified) });
    }

    if (donor_id !== undefined) {
      query = query.where({ "organizations.donor_id": Number(donor_id) });
    }

    const organizations = await query.orderBy(
      "organizations.created_at",
      "asc"
    );

    res.status(200).json({
      status: "success",
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    console.error("Get All Organizations Error:", error);
    res.status(500).json({
      error: "An error occurred while fetching organizations",
    });
  }
};

function generateRandomPassword(length: number = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export const addSingleNGO = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const transaction = await db.transaction();

  try {
    const {
      name,
      email,
      phone,
      address,
      state,
      city_lga,
      interest_area,
      cac,
      website,
      accountName,
      accountNumber,
      bankName,
      bvn,
    } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({
        error: "Name, email, and phone are required fields",
      });
      return;
    }

    const mail = email.trim();

    const existingUser = await db("users").where({ email: mail }).first();
    if (existingUser) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }

    const generatedPassword = generateRandomPassword(12);
    const hashedPassword = hash(generatedPassword.trim());

    const [userId] = await transaction("users").insert({
      email: mail,
      password: hashedPassword,
      active: 1,
      role: "NGO",
      status: 1,
      token: 0,
    });

    await transaction("organizations").insert({
      name,
      phone,
      website: website || null,
      interest_area: interest_area || null,
      cac: cac || null,
      user_id: userId,
      active: 1,
      is_verified: 0,
    });

    if (address || state || city_lga) {
      await transaction("address").insert({
        address: address || null,
        state: state || null,
        city_lga: city_lga || null,
        user_id: userId,
      });
    }

    if (bankName || accountNumber || accountName) {
      await transaction("banks").insert({
        bankName: bankName || null,
        accountName: accountName || null,
        accountNumber: accountNumber || null,
        bvn: bvn || null,
        user_id: userId,
      });
    }

    await transaction.commit();

    try {
      await new Email({
        email: mail,
        url: "",
        token: 0,
        additionalData: {
          subject: "Welcome to GivingBack - Your NGO Account",
          password: generatedPassword,
          name,
        },
      }).sendEmail("ngowelcome", "Your NGO Account Has Been Created");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }

    res.status(201).json({
      status: "success",
      message: "NGO added successfully",
      data: {
        userId,
        email: mail,
        name,
        note: "A welcome email with login credentials has been sent to the organization",
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Add Single NGO Error:", error);
    res.status(500).json({
      error: "An error occurred while adding the NGO",
    });
  }
};

const bulkUploadNGOs = async (fileBuffer: Buffer) => {
  try {
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = xlsx.utils.sheet_to_json(sheet);

    const ngos = rows.filter((row) => row.Name && row.Email && row.Phone);

    if (ngos.length === 0) {
      return {
        success: false,
        error: "No valid rows found in the file",
      };
    }

    const successCount: any[] = [];
    const errorCount: any[] = [];

    await db.transaction(async (trx: any) => {
      for (const ngo of ngos) {
        try {
          const mail = ngo.Email.trim();

          const existingUser = await trx("users")
            .where({ email: mail })
            .first();
          if (existingUser) {
            errorCount.push({
              name: ngo.Name,
              email: mail,
              error: "Email already exists",
            });
            continue;
          }

          const generatedPassword = generateRandomPassword(12);
          const hashedPassword = hash(generatedPassword.trim());

          const [userId] = await trx("users").insert({
            email: mail,
            password: hashedPassword,
            active: 1,
            role: "NGO",
            status: 1,
            token: 0,
          });

          await trx("organizations").insert({
            name: ngo.Name,
            phone: ngo.Phone,
            website: ngo.Website || null,
            interest_area: ngo.Interest_Area || null,
            cac: ngo.CAC || null,
            user_id: userId,
            active: 1,
            is_verified: 0,
          });

          if (ngo.Address || ngo.State || ngo.City_LGA) {
            await trx("address").insert({
              address: ngo.Address || null,
              state: ngo.State || null,
              city_lga: ngo.City_LGA || null,
              user_id: userId,
            });
          }

          if (ngo.BankName || ngo.AccountNumber || ngo.AccountName) {
            await trx("banks").insert({
              bankName: ngo.BankName || null,
              accountName: ngo.AccountName || null,
              accountNumber: ngo.AccountNumber || null,
              bvn: ngo.BVN || null,
              user_id: userId,
            });
          }

          successCount.push({
            name: ngo.Name,
            email: mail,
            userId,
            password: generatedPassword,
          });

          try {
            await new Email({
              email: mail,
              url: "",
              token: 0,
              additionalData: {
                subject: "Welcome to GivingBack - Your NGO Account",
                password: generatedPassword,
                name: ngo.Name,
              },
            }).sendEmail("ngowelcome", "Your NGO Account Has Been Created");
          } catch (emailError) {
            console.error("Error sending email to " + mail + ":", emailError);
          }
        } catch (error) {
          errorCount.push({
            name: ngo.Name,
            email: ngo.Email,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      }
    });

    return {
      success: true,
      message: "Bulk upload completed",
      summary: {
        total: ngos.length,
        successful: successCount.length,
        failed: errorCount.length,
      },
      successData: successCount,
      errors: errorCount.length > 0 ? errorCount : undefined,
    };
  } catch (error) {
    console.error("Error occurred during bulk upload:", error);
    return {
      success: false,
      error: `Unable to perform bulk upload: ${error}`,
    };
  }
};

export const bulkUploadNGOsEndpoint = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).json({ error: "File is required" });
      return;
    }

    const fileBuffer = req.file.buffer;
    const result = await bulkUploadNGOs(fileBuffer);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error in bulk upload route:", error);
    res.status(500).json({ error: "Unable to upload data" });
  }
};

export const downloadSampleNGOFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workbook = xlsx.utils.book_new();
    const sampleData = [
      [
        "Name",
        "Email",
        "Phone",
        "Address",
        "State",
        "City_LGA",
        "Interest_Area",
        "CAC",
        "Website",
        "BankName",
        "AccountName",
        "AccountNumber",
        "BVN",
      ],
      [
        "Example NGO",
        "contact@examplengo.org",
        "+234812345678",
        "123 Main Street",
        "Lagos",
        "Ikeja",
        "Education,Healthcare",
        "RC12345678",
        "https://examplengo.org",
        "First Bank",
        "Example NGO",
        "1234567890",
        "11123456789",
      ],
      [
        "Another NGO",
        "info@anotherngo.org",
        "+234807654321",
        "456 Oak Avenue",
        "Abuja",
        "Central Business District",
        "Environment,Community Development",
        "RC87654321",
        "https://anotherngo.org",
        "GTBank",
        "Another NGO Ltd",
        "9876543210",
        "22234567890",
      ],
    ];

    const sheet = xlsx.utils.aoa_to_sheet(sampleData);

    sheet["!cols"] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
    ];

    xlsx.utils.book_append_sheet(workbook, sheet, "Sample NGOs");

    const buffer = xlsx.write(workbook, { type: "buffer" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sample_ngos_bulk.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error generating sample file:", error);
    res.status(500).json({ error: "Unable to generate sample file" });
  }
};

export const getDonorProjectMetrics = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;

    if (!userId) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const donor = await db("donors").where({ user_id: userId }).first();

    if (!donor) {
      res.status(200).json({
        completedProjects: 0,
        activeBriefs: 0,
        ongoingProjects: 0,
        totalApplications: 0,
      });
      return;
    }

    const donorId = donor.id;

    const completedResult: any = await db("project")
      .where({
        donor_id: donorId,
        status: "completed",
      })
      .count("id as count")
      .first();
    const completedProjects = completedResult?.count || 0;

    const briefResult: any = await db("project")
      .where({ donor_id: donorId, status: "brief" })
      .count("id as count")
      .first();
    const activeBriefs = briefResult?.count || 0;

    const activeResult: any = await db("project")
      .where({ donor_id: donorId, status: "active" })
      .count("id as count")
      .first();
    const ongoingProjects = activeResult?.count || 0;

    const applicationsResult: any = await db("project")
      .where({ donor_id: donorId })
      .sum("applications as totalApplications")
      .first();
    const totalApplications = applicationsResult?.totalApplications || 0;

    res.status(200).json({
      completedProjects,
      activeBriefs,
      ongoingProjects,
      totalApplications,
    });
  } catch (error) {
    console.error("Get Donor Project Metrics Error:", error);
    res.status(500).json({
      error: "An error occurred while fetching project metrics",
    });
  }
};

export const getDonorProjects = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const donor = await db("donors").where({ user_id: userId }).first();

    if (!donor) {
      res.status(404).json({ error: "Donor not found" });
      return;
    }

    const donorId = donor.id;

    const projects = await db("project")
      .where({ donor_id: donorId })
      .select(
        "id",
        "title",
        db.raw('DATE_FORMAT(startDate, "%Y-%m-%d") AS startDate'),
        db.raw('DATE_FORMAT(endDate, "%Y-%m-%d") AS endDate'),
        "description",
        "objectives",
        "category",
        "organization_id",
        "cost",
        "scope",
        "allocated",
        "beneficiary_overview",
        "status",
        "applications",
        "createdAt",
        "updatedAt"
      )
      .orderBy("createdAt", "desc");

    res.status(200).json({
      status: "success",
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get Donor Projects Error:", error);
    res.status(500).json({
      error: "An error occurred while fetching donor projects",
    });
  }
};

export const createProject = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const transaction = await db.transaction();

  try {
    const userId = (req.user as User)?.id;

    if (!userId) {
      res.status(401).json({
        status: "fail",
        message: "Unauthorized: User not found",
      });
      return;
    }

    const donor = await db("donors").where({ user_id: userId }).first();

    if (!donor) {
      res.status(400).json({
        status: "fail",
        message: "User is not registered as a donor",
      });
      return;
    }

    const donorId = donor.id;

    const {
      title,
      category,
      description,
      budget,
      deadline,
      state,
      lga,
      status,
    } = req.body;

    const missingFields: string[] = [];
    if (!title) missingFields.push("title");
    if (!category) missingFields.push("category");
    if (!description) missingFields.push("description");
    if (!budget) missingFields.push("budget");
    if (!deadline) missingFields.push("deadline");
    if (!state) missingFields.push("state");
    if (!lga) missingFields.push("lga");
    if (!status) missingFields.push("status");

    if (missingFields.length > 0) {
      res.status(400).json({
        status: "fail",
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      return;
    }

    const cost = parseFloat(String(budget));
    if (isNaN(cost) || cost <= 0) {
      res.status(400).json({
        status: "fail",
        error: "Budget must be a valid positive number",
      });
      return;
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      res.status(400).json({
        status: "fail",
        error: "Deadline must be a valid date (YYYY-MM-DD)",
      });
      return;
    }

    const validStatuses = ["draft", "brief", "active", "completed"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        status: "fail",
        error: `Status must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    const [projectId] = await transaction("project").insert({
      title: title.trim(),
      category,
      description,
      cost,
      endDate: deadline,
      startDate: new Date(),
      state,
      city: lga,
      status,
      donor_id: donorId,
      organization_id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await transaction.commit();

    const createdProject = await db("project").where({ id: projectId }).first();

    // Get donor email and details for notification
    const donorUser = await db("users").where({ id: userId }).first();
    const donorInfo = await db("donors").where({ id: donorId }).first();

    // Send email based on project status
    try {
      if (status === "draft") {
        // Send confirmation email for draft project
        await new Email({
          email: donorUser.email,
          url: "",
          token: 0,
          additionalData: {
            subject: "Project Brief Saved as Draft",
            projectTitle: createdProject.title,
            projectDescription: createdProject.description,
            budget: createdProject.cost,
            donorName: donorInfo?.name || "Donor",
          },
        }).sendEmail("donorbriefdraft", "Project Brief Saved as Draft");
      } else if (status === "brief") {
        // Send notification for project brief ready for review
        await new Email({
          email: donorUser.email,
          url: "",
          token: 0,
          additionalData: {
            subject: "Your Project Brief is Ready for Review",
            projectTitle: createdProject.title,
            projectDescription: createdProject.description,
            budget: createdProject.cost,
            donorName: donorInfo?.name || "Donor",
            state: createdProject.state,
            city: createdProject.city,
          },
        }).sendEmail(
          "donorbriefready",
          "Your Project Brief is Ready for Review"
        );
      } else if (status === "active") {
        // Send notification for active project
        await new Email({
          email: donorUser.email,
          url: "",
          token: 0,
          additionalData: {
            subject: "Your Project is Now Active",
            projectTitle: createdProject.title,
            projectDescription: createdProject.description,
            budget: createdProject.cost,
            donorName: donorInfo?.name || "Donor",
            state: createdProject.state,
            city: createdProject.city,
          },
        }).sendEmail("donorbriefactive", "Your Project is Now Active");
      }
    } catch (emailError) {
      console.error("Error sending project notification email:", emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      status: "success",
      message: "Project brief created successfully",
      data: {
        id: createdProject.id,
        title: createdProject.title,
        category: createdProject.category,
        description: createdProject.description,
        budget: createdProject.cost,
        deadline: createdProject.deadline,
        state: createdProject.state,
        city: createdProject.city,
        status: createdProject.status,
        donor_id: createdProject.donor_id,
        createdAt: createdProject.createdAt,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Create Project Error:", error);

    res.status(500).json({
      status: "fail",
      error: "An error occurred while creating the project brief",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const publishProjectBrief = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        status: "fail",
        message: "Unauthorized: User not found",
      });
      return;
    }

    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        status: "fail",
        error: "Invalid project ID",
      });
      return;
    }

    // Get donor_id from donors table using user_id
    const donor = await db("donors").where({ user_id: userId }).first();

    if (!donor) {
      res.status(400).json({
        status: "fail",
        message: "User is not registered as a donor",
      });
      return;
    }

    // Fetch the project
    const project = await db("project").where({ id }).first();

    if (!project) {
      res.status(404).json({
        status: "fail",
        error: "Project not found",
      });
      return;
    }

    // Verify that the project belongs to the authenticated donor
    if (project.donor_id !== donor.id) {
      res.status(403).json({
        status: "fail",
        error: "You do not have permission to update this project",
      });
      return;
    }

    // Check if project is in draft status
    if (project.status !== "draft") {
      res.status(400).json({
        status: "fail",
        error: `Project is in ${project.status} status. Only draft projects can be published to brief status`,
      });
      return;
    }

    // Update project status to brief
    await db("project").where({ id }).update({
      status: "brief",
      updatedAt: new Date(),
    });

    // Fetch updated project
    const updatedProject = await db("project").where({ id }).first();

    // Get donor email and details for notification
    const donorUser = await db("users").where({ id: userId }).first();
    const donorInfo = await db("donors").where({ id: donor.id }).first();

    // Send email notification for project brief ready for review
    try {
      await new Email({
        email: donorUser.email,
        url: "",
        token: 0,
        additionalData: {
          subject: "Your Project Brief is Ready for Review",
          projectTitle: updatedProject.title,
          projectDescription: updatedProject.description,
          budget: updatedProject.cost,
          donorName: donorInfo?.name || "Donor",
          state: updatedProject.state,
          city: updatedProject.city,
        },
      }).sendEmail("donorbriefready", "Your Project Brief is Ready for Review");
    } catch (emailError) {
      console.error(
        "Error sending project publish notification email:",
        emailError
      );
      // Continue even if email fails
    }

    res.status(200).json({
      status: "success",
      message: "Project status updated to brief successfully",
      data: {
        id: updatedProject.id,
        title: updatedProject.title,
        category: updatedProject.category,
        description: updatedProject.description,
        budget: updatedProject.cost,
        deadline: updatedProject.endDate,
        state: updatedProject.state,
        city: updatedProject.city,
        status: updatedProject.status,
        donor_id: updatedProject.donor_id,
        updatedAt: updatedProject.updatedAt,
      },
    });
  } catch (error) {
    console.error("Publish Project Brief Error:", error);

    res.status(500).json({
      status: "fail",
      error: "An error occurred while updating the project status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
