import { NextFunction, Request, Response } from "express";
import db from "../../config";
import { User } from "../../interfaces";
import Email from "../../utils/mail";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user_id = (req.user as User)?.id;

    const { name, phone, website, interest_area, cac } = req.body;

    const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!phone) missingFields.push("phone");
    // if (!website) missingFields.push('website');
    if (!interest_area) missingFields.push("interest_area");
    if (!cac) missingFields.push("cac");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "fail",
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }

    const newOrg = {
      name,
      phone,
      website,
      interest_area,
      cac,
      user_id,
    };

    const [id] = await db("organizations").insert(newOrg).returning("id");
    const org = await db("organizations").where({ id }).first();
    const banksDetails = await db("banks")
      .select("bankName", "accountNumber", "accountName")
      .where("user_id", user_id)
      .first();

    const addressDetails = await db("address")
      .select("state", "city_lga", "address")
      .where("user_id", user_id)
      .first();

    const response = {
      Details: org,
      Bank: {
        bank_name: banksDetails?.bankName,
        account_number: banksDetails?.accountNumber,
        account_name: banksDetails?.accountName,
      },
      Address: {
        city: addressDetails?.city_lga,
        state: addressDetails?.state,
        address: addressDetails?.address,
      },
    };

    //email
    const userData = await db("users").where("id", user_id).first();
    if (!userData) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }
    const email = userData.email;

    const token = 0;
    const url = name;
    const additionalData = { role: "NGO" };

    await new Email({ email: email, url, token, additionalData }).sendEmail(
      "donoronboard",
      "Welcome to the GivingBack Family!"
    );
    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("adminonb", "New User");
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in create organization:", error);
    res.status(500).json({
      status: "fail",
      message: "An error occurred while creating the organization.",
    });
  }
};

interface Sponsor {
  name?: string;
  sponsorDescription?: string;
}

interface Beneficiary {
  name?: string;
  contact?: string;
  location?: string;
}

export const createp = async (req: any, res: Response) => {
  const transaction = await db.transaction();

  try {
    const {
      title,
      category,
      duration,
      description,
      cost,
      raised,
      sponsors,
      beneficiaries,
    } = req.body;

    const missingFields: string[] = [];

    const userData = await db("organizations")
      .where("user_id", req.user.id)
      .first();
    if (!userData) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    if (!title) missingFields.push("title");
    if (!category) missingFields.push("category");
    if (!duration) missingFields.push("duration");
    if (!description) missingFields.push("description");
    if (!cost) missingFields.push("cost");
    if (!sponsors) missingFields.push("sponsors");
    if (!beneficiaries) missingFields.push("beneficiaries");

    if (sponsors && !Array.isArray(sponsors)) {
      return res.status(400).json({
        status: "fail",
        error: "Sponsors must be an array",
      });
    }

    if (beneficiaries && !Array.isArray(beneficiaries)) {
      return res.status(400).json({
        status: "fail",
        error: "Beneficiaries must be an array",
      });
    }

    if (sponsors && sponsors.length > 0) {
      sponsors.forEach((sponsor: Sponsor, index: number) => {
        const sponsorImage = req.files.find(
          (file: any) => file.fieldname === `sponsors[${index}][image]`
        );
        if (!sponsorImage) {
          missingFields.push(`sponsors[${index}][image]`);
        }
      });
    }

    const mainImage = req.files.find((file: any) => file.fieldname === "image");
    if (!mainImage) {
      missingFields.push("image");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "fail",
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }

    const [projectId] = await db("previousprojects")
      .insert({
        title,
        category,
        duration,
        status: "unverified",
        description,
        cost,
        raised,
        organization_id: userData.id,
      })
      .returning("id");

    if (sponsors && sponsors.length > 0) {
      await Promise.all(
        sponsors.map(async (sponsor: Sponsor, index: number) => {
          const { name, sponsorDescription } = sponsor;
          const sponsorImage = req.files.find(
            (file: any) => file.fieldname === `sponsors[${index}][image]`
          );

          const sponsorData = {
            project_id: projectId,
            name: name || "",
            image: sponsorImage ? sponsorImage.location : "",
            description: sponsorDescription || "",
          };

          await db("previousprojects_sponsors").insert(sponsorData);
        })
      );
    }

    if (beneficiaries && beneficiaries.length > 0) {
      await Promise.all(
        beneficiaries.map(async (beneficiary: Beneficiary) => {
          const { name, contact, location } = beneficiary;

          const beneficiaryData = {
            project_id: projectId,
            name: name || "",
            contact: contact || "",
            location: location || "",
          };

          await db("previousprojects_beneficiaries").insert(beneficiaryData);
        })
      );
    }

    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file: any) => {
          if (file.fieldname === "image") {
            const filename = file.location;
            await db("previousprojects_images").insert({
              image: filename,
              project_id: projectId,
            });
          }
        })
      );
    }

    await transaction.commit();

    const token = 0;
    const url = "";
    const additionalData = {
      ngoName: userData.name,
      projectTitle: title,
      projectDescription: description,
    };

    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("pastpadmin", "New Past Project");
    res.status(201).json({ message: "Previous Project created successfully" });
  } catch (error) {
    await transaction.rollback();

    console.error("Error creating project:", error);
    res.status(500).json({ error: "Unable to create project" });
  }
};

export const addMilestoneUpdate = async (req: any, res: Response) => {
  try {
    const { achievement, position, status, narration, milestone_id } = req.body;
    let filename: string | null = null;

    const missingFields: string[] = [];
    if (!achievement) missingFields.push("achievement");
    if (!status) missingFields.push("status");
    if (!narration) missingFields.push("narration");
    if (!milestone_id) missingFields.push("milestone_id");

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      if ((req.files[0] as any).fieldname === "image") {
        filename = (req.files[0] as any).location;
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "fail",
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }

    const [newMilestoneUpdateId] = await db("milestone_update").insert({
      achievement,
      position,
      status,
      narration,
      image: filename,
      milestone_id,
    });

    const newMilestoneUpdate = await db("milestone_update")
      .where({ id: newMilestoneUpdateId })
      .first();

    res.status(201).json({ newMilestoneUpdate });
  } catch (error) {
    console.error("Error adding milestone update:", error);
    res.status(500).json({ error: "Unable to add milestone update" });
  }
};

export const withdraw = async (req: any, res: Response) => {
  try {
    const { amount, accountNumber, bank, saveAccount } = req.body;

    const trx = await db.transaction();

    let userData = await db("organizations")
      .where("user_id", req.user.id)
      .first();
    let userData1 = await db("users").where("id", req.user.id).first();

    const [donationId] = await trx("donations")
      .insert({
        amount,
        ngo_id: userData.id,
        type: "Withdrawal Request",
      })
      .returning("id");

    await trx("transactions").insert({
      donation_id: donationId,
      payment_gateway: "Paystack",
      status: "pending",
    });
    await trx("donation_messages").insert({
      donation_id: donationId,
      message: "A new withdrawal request has been created.",
      subject: "Withdrawal Request",
    });
    if (saveAccount) {
      const newBank = {
        bankName: bank,
        accountName: "",
        accountNumber,
        user_id: req.user.id,
      };
      await trx("banks").insert(newBank);
    }

    trx.commit();

    const token = 0;
    const url = "name";
    const currentDate = new Date();
    const additionalData = {
      ngoName: userData.name,
      amount,
      currency: "NGN",
      requestDate: currentDate,
    };
    await new Email({
      email: userData1.email,
      url,
      token,
      additionalData,
    }).sendEmail("ngowithdraw", "Withdrawal Request submitted");
    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("adminwithdraw", "New withdrawal Request");
    res.status(201).json({ message: "Request Submitted" });
  } catch (error) {
    console.error("Error creating withdrawal request", error);
    res.status(500).json({ error: "Unable to complete process" });
  }
};

export const respondBrief = async (req: any, res: Response) => {
  try {
    const projectId = req.params.id;
    const { message } = req.body;

    await db("project").where({ id: projectId }).update({
      status: "active",
    });

    const userData3 = await db("project").where("id", projectId).first();
    let userData = await db("organizations")
      .where("user_id", req.user.id)
      .first();
    let userData4 = await db("users").where("id", req.user.id).first();
    const userData2 = await db("donors")
      .where("id", userData3.donor_id)
      .first();
    const userData5 = await db("donations")
      .where("type", "allocated")
      .where("ngo_id", userData.id)
      .where("donor_id", userData3.donor_id)
      .where("project_id", projectId)
      .first();
    if (!userData2) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    const token = 0;
    const url = userData.name;
    const additionalData = {
      projectDescription: userData3.description,
      fundingAmount: userData5.amount,
      projectTitle: userData3.title,
      currency: "NGN",
      ngoName: userData.name,
      donorName: userData2.name,
    };

    await new Email({
      email: userData4.email,
      url,
      token,
      additionalData,
    }).sendEmail("ngoaccetpbrief", "Project Acceptance");

    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("adminngoacceptbrief", "Project Acceptance");
    res.status(200).json({ message: "Project accepted" });
  } catch (error) {
    res.status(500).json({ error: "Unable to update project" });
  }
};

//v2
export const createProject = async (req: Request, res: Response) => {
  const trx = await db.transaction();
  try {
    const {
      title,
      description,
      status,
      duration,
      startDate,
      endDate,
      interest_area,
      orgemail,
      cost,
      raised,
      milestones,
      sponsors,
      beneficiaries,
    } = req.body;

    // const organization = await db("organizations")
    //   .where({ email: orgemail })
    //   .first();
    // if (!organization)
    //   return res.status(404).json({ error: "Organization not found" });
    const organization = await db("organizations")
      .where("user_id", req.user.id)
      .first();
    if (!organization) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    const [project_id] = await trx("project").insert({
      title,
      description,
      status,
      startDate,
      endDate,
      category: interest_area,
      cost,
      allocated: raised,
      organization_id: organization.id,
    });

    if (milestones && milestones.length > 0) {
      const milestoneData = milestones.map((m: any) => ({
        milestone: m.milestone,
        status: m.mstatus,
        description: m.miledes,
        target: 0,
        project_id,
        organization_id: organization.id,
      }));
      await trx("milestone").insert(milestoneData);
    }

    if (sponsors && sponsors.length > 0) {
      const sponsorUploads = Array.isArray(req.files)
        ? req.files.filter((file: any) =>
            file.fieldname.startsWith("sponsors[")
          )
        : [];
      for (let i = 0; i < sponsors.length; i++) {
        await trx("project_sponsor").insert({
          name: sponsors[i].sponsor,
          image: (sponsorUploads?.[i] as any)?.location || null,
          description: sponsors[i].sdesc,
          project_id,
        });
      }
    }

    if (beneficiaries && beneficiaries.length > 0) {
      const beneficiaryData = beneficiaries.map((b: any) => ({
        state: b.state || "",
        city: b.city || "",
        community: b.address,
        contact: b.contact,
        project_id,
      }));
      await trx("beneficiary").insert(beneficiaryData);
    }

    const imageUploads = Array.isArray(req.files)
      ? req.files.filter((file: any) => file.fieldname.startsWith("images["))
      : [];

    if (imageUploads && imageUploads.length > 0) {
      const imageData = imageUploads.map((img: any) => ({
        image: img.location,
        project_id,
      }));
      await trx("project_images").insert(imageData);
    }

    await trx.commit();
    res
      .status(201)
      .json({ message: "Project created successfully", project_id });
  } catch (error: any) {
    await trx.rollback();
    res.status(500).json({ error: error.message });
  }
};
export const addMilestones = async (req: Request, res: Response) => {
  const { project_id } = req.params;
  const { milestones } = req.body;
  const organization = await db("organizations")
    .where("user_id", req.user.id)
    .first();

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  const milestoneData = milestones.map((m: any) => ({
    milestone: m.milestone,
    status: m.mstatus,
    description: m.miledes,
    target: 0,
    project_id,
    organization_id: organization.id,
  }));

  try {
    await db("milestone").insert(milestoneData);
    res.status(201).json({ message: "Milestones added successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const addSponsors = async (req: Request, res: Response) => {
  const { project_id } = req.params;
  const { sponsors } = req.body;
  const sponsorUploads = Array.isArray(req.files)
    ? req.files.filter((file: any) => file.fieldname.startsWith("sponsors["))
    : [];

  const sponsorData = sponsors.map((s: any, i: number) => ({
    name: s.sponsor,
    image: (sponsorUploads?.[i] as any)?.location || null,
    description: s.sdesc,
    project_id,
  }));

  try {
    await db("project_sponsor").insert(sponsorData);
    res.status(201).json({ message: "Sponsors added successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const addBeneficiaries = async (req: Request, res: Response) => {
  const { project_id } = req.params;
  const { beneficiaries } = req.body;

  const data = beneficiaries.map((b: any) => ({
    state: b.state || "",
    city: b.city || "",
    community: b.address,
    contact: b.contact,
    project_id,
  }));

  try {
    await db("beneficiary").insert(data);
    res.status(201).json({ message: "Beneficiaries added successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const addProjectImages = async (req: Request, res: Response) => {
  const { project_id } = req.params;

  const imageUploads = Array.isArray(req.files)
    ? req.files.filter((file: any) => file.fieldname.startsWith("images["))
    : [];

  const imageData = imageUploads.map((img: any) => ({
    image: img.location,
    project_id,
  }));

  try {
    await db("project_images").insert(imageData);
    res.status(201).json({ message: "Images uploaded successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteMilestone = async (req: Request, res: Response) => {
  const { milestone_id } = req.params;
  try {
    await db("milestone").where({ id: milestone_id }).del();
    res.json({ message: "Milestone removed" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteSponsor = async (req: Request, res: Response) => {
  const { sponsor_id } = req.params;
  try {
    const deleted = await db("project_sponsor").where({ id: sponsor_id }).del();

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "fail", message: "Sponsor not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Sponsor deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Delete Beneficiary
export const deleteBeneficiary = async (req: Request, res: Response) => {
  const { beneficiary_id } = req.params;
  try {
    const deleted = await db("beneficiary").where({ id: beneficiary_id }).del();

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "fail", message: "Beneficiary not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Beneficiary deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Delete Project Image
export const deleteImage = async (req: Request, res: Response) => {
  const { image_id } = req.params;
  try {
    const deleted = await db("project_images").where({ id: image_id }).del();

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "fail", message: "Image not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Image deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Similarly for sponsor, beneficiary, image...
