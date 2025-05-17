import { NextFunction, Response } from "express";
import db from "../../config";
import { getCounts } from "../../helper/dash";
import { fetchUsers } from "../../helper/getusers";
import { User, UserRequest } from "../../interfaces";
import Email from "../../utils/mail";

export const getCountsHandler = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id;

    const donor = await db("donors")
      .where({ user_id: userId })
      .select("id")
      .first();

    let isDonor = !!donor;
    let orgId: string | undefined;

    if (!donor) {
      const organization = await db("organizations")
        .where({ user_id: userId })
        .select("id")
        .first();
      if (!organization) {
        return res.status(404).json({
          status: "fail",
          message: "No donor or organization found for this user.",
        });
      }
      orgId = organization.id;
    }

    const counts = await getCounts(userId, isDonor, orgId);

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch dashboard data" });
  }
};

export const newDonor = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const transaction = await db.transaction();

  try {
    const user_id = (req.user as User)?.id;

    // Fetch user data
    const userData = await db("users").where("id", user_id).first();
    if (!userData) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }
    const email = userData.email;

    // Destructure required fields from request body
    const {
      name,
      phoneNumber,
      industry,
      interest_area,
      state,
      city_lga,
      address,
      about,
    } = req.body;

    // Validate missing fields
    const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!phoneNumber) missingFields.push("phoneNumber");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "fail",
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }

    const additionalFields: any = { ...req.body };
    const requiredFields = [
      "name",
      "phoneNumber",
      "industry",
      "interest_area",
      "state",
      "city_lga",
      "address",
      "about",
    ];
    requiredFields.forEach((field) => delete additionalFields[field]);

    const [donorId] = await db("donors").insert({
      name,
      phoneNumber,
      industry,
      email,
      interest_area,
      state,
      city_lga,
      address,
      about,
      user_id,
      additional_information: JSON.stringify(additionalFields),
    });

    const newDonor = await db("donors").where("id", donorId).first();

    await db("users").where("id", user_id).update({
      role: "donor",
      status: 1,
      token: 0,
    });

    await transaction.commit();

    //email
    const token = 0;
    const url = name;
    const additionalData = { role: "Donor" };
    await new Email({ email: email, url, token, additionalData }).sendEmail(
      "donoronboard",
      "Welcome to the GivingBack Family!"
    );
    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("adminonb", "New user");

    res.status(201).json({
      message: "Donor created successfully",
      donor: newDonor,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    res.status(500).json({
      error: "Unable to create donor",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllUsers = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await fetchUsers(req.query);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessageToNGO = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id;

    const ngoId = req.params.id;
    const { subject, message }: any = req.body;

    const org = await db("organizations").where("id", ngoId).first();

    if (!org) {
      return res.status(404).json({
        message: "NGO not found",
      });
    }

    const newDonor = await db("messages").insert({
      subject,
      message,
      sender_id: userId,
      sender_type: "donor",
      user_id: org.user_id,
    });

    res.status(200).json({
      message: "Message sent successfully",
      newDonor,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

export const feedBack = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!id || !comment) {
      res.status(400).json({ error: "Project ID and comment are required" });
      return;
    }

    await db("donor_comment").insert({
      project_id: id,
      comment: comment,
    });

    res.status(201).json({ message: "Comment Submitted" });
  } catch (error) {
    console.error("Error creating projects:", error);
    res.status(500).json({ error: "Unable to submit comment" });
  }
};

export const addRecipient = async (req: any, res: Response) => {
  const {
    ngoId,
    name,
    donorId,
  }: { ngoId: string; name: string; donorId: string } = req.body;

  try {
    // Check if the recipient already exists
    const existingRecipient = await db("donor_beneficiary")
      .where({
        ngo_id: ngoId,
        name: name,
        donor_id: donorId,
      })
      .first();

    if (existingRecipient) {
      return res.status(400).json({ message: "Recipient already exists" });
    }

    // Insert the new recipient
    const [newRecipient] = await db("donor_beneficiary").insert(
      {
        ngo_id: ngoId,
        name: name,
        donor_id: donorId,
      },
      ["id"]
    );

    res.status(201).json(newRecipient);
  } catch (error) {
    res.status(500).json({ message: "Error creating recipient", error });
  }
};

// GetRecipient
export const getRecipient = async (req: any, res: Response) => {
  try {
    const donor = await db("donors")
      .where({ user_id: req.user.id })
      .select("id")
      .first();

    if (!donor) {
      return res.status(404).json({ message: "Donor not found." });
    }

    const ngoIds = await db("donor_beneficiary")
      .select("ngo_id")
      .where("donor_id", donor.id);

    if (ngoIds.length === 0) {
      return res
        .status(404)
        .json({ message: "No NGOs found for this donor ID." });
    }

    const ids = ngoIds.map((ngo) => ngo.ngo_id);

    const ngosWithAddresses = await db("organizations as org")
      .select("org.*", "addr.*")
      .leftJoin("address as addr", "org.user_id", "addr.user_id")
      .whereIn("org.id", ids);

    return res.json(ngosWithAddresses);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching NGOs.", error });
  }
};

// Donate
export const donate = async (req: any, res: Response) => {
  const trx = await db.transaction();

  try {
    const {
      amount,
      project_id,
      ngo_id,
      donor_id,
      type = "Donated",
    }: {
      amount: string;
      project_id: string;
      ngo_id: string;
      donor_id: string;
      type?: string;
    } = req.body;

    const donationAmount = parseFloat(amount);

    const wallet = await trx("wallet").where("user_id", donor_id).first();

    if (!wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for this donor" });
    }

    if (wallet.balance < donationAmount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in wallet" });
    }

    const updatedBalance = wallet.balance - donationAmount;
    await trx("wallet")
      .where("user_id", donor_id)
      .update({ balance: updatedBalance });

    const dono = await trx("donors")
      .where({ user_id: donor_id })
      .select("id")
      .first();

    const [donationId] = await trx("donations").insert(
      {
        amount,
        project_id,
        ngo_id,
        donor_id: dono?.id,
        type,
      },
      ["id"]
    );

    const ngoWallet = await trx("wallet").where("user_id", ngo_id).first();

    if (!ngoWallet) {
      return res.status(404).json({ message: "Wallet not found for this NGO" });
    }

    const updatedNgoBalance = ngoWallet.balance + donationAmount;
    await trx("wallet")
      .where("user_id", ngo_id)
      .update({ balance: updatedNgoBalance });

    await trx.commit();

    //email

    let userData = await db("organizations").where("user_id", ngo_id).first();
    let userData4 = await db("users").where("id", ngo_id).first();
    const userData2 = await db("donors").where("user_id", donor_id).first();
    const userData3 = await db("project").where("id", project_id).first();
    if (!userData2) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }
    const email = userData2.email;
    const currentDate = new Date();

    const token = 0;
    const url = userData.name;
    const additionalData = {
      projectTitle: userData3.title,
      currency: "NGN",
      ngoName: userData.name,
      amount: amount,
      donorName: userData2.name,
      donationDate: currentDate,
    };
    await new Email({
      email: userData4.email,
      url,
      token,
      additionalData,
    }).sendEmail("receivengo", "Donation Received");
    await new Email({ email: email, url, token, additionalData }).sendEmail(
      "donatengo",
      "Donation Received"
    );
    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("admindonate", "New Donation");

    res.status(201).json({
      message: "Donation added successfully",
      donationId,
      updatedBalance,
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);
    res.status(500).json({ message: "Error adding donation" });
  }
};

export const getAllUserPresentProjects = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Fetch organization by user ID
    const user = await db("organizations")
      .where({ user_id: id })
      .select(
        "id",
        "name",
        "phone",
        "website",
        "interest_area",
        "cac",
        "active",
        "user_id"
      )
      .first();

    if (!user) {
      res.status(404).json({ error: "User organization not found" });
      return;
    }

    const {
      page = 1,
      limit = 10,
      status,
      title,
      startDate,
      endDate,
    }: {
      page?: number;
      limit?: number;
      status?: string;
      title?: string;
      startDate?: string;
      endDate?: string;
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    // Query for projects
    let query = db("project")
      .where({ organization_id: user.id })
      .select(
        "id",
        "title",
        db.raw('DATE_FORMAT(startDate, "%Y-%m-%d") AS startDate'),
        db.raw('DATE_FORMAT(endDate, "%Y-%m-%d") AS endDate'),
        "description",
        "objectives",
        "category",
        "donor_id",
        "cost",
        "scope",
        "allocated",
        "beneficiary_overview",
        "status",
        "createdAt",
        "updatedAt"
      );

    // Filter conditions
    if (status) {
      query = query.where(db.raw("LOWER(status)"), "=", status.toLowerCase());
    }
    if (title) {
      query = query.where(
        db.raw("LOWER(title)"),
        "LIKE",
        `%${title.toLowerCase()}%`
      );
    }
    if (startDate) {
      query = query.where("startDate", ">=", startDate);
    }
    if (endDate) {
      query = query.where("endDate", "<=", endDate);
    }

    // Get total items count
    const [totalItems] = await db("project")
      .where({ organization_id: user.id })
      .count("id as total");

    const count: number = parseInt(totalItems?.total as string, 10) || 0;
    const totalPages = Math.ceil(count / Number(limit));

    // Paginate query
    query = query.limit(Number(limit)).offset(offset);

    const userPresentProjects = await query;

    // Map project details
    const projectsWithDetails = await Promise.all(
      userPresentProjects.map(async (project: any) => {
        const projectId = project.id;
        const donorId = project.donor_id;

        // Fetch donor details
        const donorDetails = await db("donors")
          .where({ id: donorId })
          .select(
            "name",
            "phoneNumber",
            "industry",
            "email",
            "interest_area",
            "state",
            "city_lga",
            "address",
            "about",
            "image"
          )
          .first();

        // Fetch milestones and updates
        const milestones = await db("milestone")
          .where({ project_id: projectId })
          .select("id", "milestone", "target");

        const outputMilestones = await Promise.all(
          milestones.map(async (milestone: any) => {
            const updates = await db("milestone_update")
              .where({ milestone_id: milestone.id })
              .select(
                "achievement",
                "position",
                "status",
                "narration",
                "createdAt"
              );

            return {
              id: milestone.id,
              milestone: milestone.milestone,
              target: milestone.target,
              milestoneUpdates: updates.map((update: any) => ({
                achievement: update.achievement,
                position: update.position,
                status: update.status,
                narration: update.narration,
                createdAt: update.createdAt,
              })),
            };
          })
        );

        // Fetch beneficiaries
        const beneficiary = await db("beneficiary")
          .where({ project_id: projectId })
          .select("state", "city", "community", "contact");

        // Fetch project images
        const images = await db("project_images")
          .where({ project_id: projectId })
          .select("id", "image");

        return {
          ...project,
          sponsor: donorDetails,
          milestones: outputMilestones,
          beneficiary,
          images,
        };
      })
    );

    // Respond with results
    res.status(200).json({
      projects: projectsWithDetails,
      totalItems: count,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch user's present projects" });
  }
};

export const addbrief = async (
  req: any,
  res: any,
  next: NextFunction
): Promise<void> => {
  const transaction = await db.transaction();

  try {
    const userId = req.user.id;

    const {
      title,
      startDate,
      endDate,
      description,
      objectives,
      category,
      cost,
      scope,
      beneficiary_overview,
      beneficiaries,
      milestones,
      donor_id,
      ngos,
      funds,
    } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!startDate) missingFields.push("startDate");
    if (!endDate) missingFields.push("endDate");
    if (!description) missingFields.push("description");
    if (!objectives) missingFields.push("objectives");
    if (!category) missingFields.push("category");
    if (!milestones || milestones.length === 0)
      missingFields.push("milestones");
    if (!donor_id) missingFields.push("donor_id");
    if (!ngos || ngos.length === 0) missingFields.push("ngos");

    // If there are any missing fields, return an error response
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "fail",
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }

    // Calculate the total fund required by converting the amount to a number
    const totalFunds = funds.reduce((acc: any, fund: any) => {
      const amount = parseFloat(fund.amount) || 0;
      return acc + amount;
    }, 0);

    // If totalFunds is 0 and there are funds provided, throw an error
    if (totalFunds === 0 && funds.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid fund amounts provided.",
      });
    }

    // Check the user's wallet balance
    const userWallet = await db("wallet").where({ user_id: userId }).first();
    if (!userWallet || userWallet.balance < totalFunds) {
      return res.status(400).json({
        status: "fail",
        message: "Insufficient balance in wallet to fund the project.",
      });
    }

    //email
    // details
    const donor = await db("donors").where({ id: donor_id }).first();
    const donorName = donor.name;

    // Proceed with project creation
    const createdProjects = [];
    await Promise.all(
      ngos.map(async (ngo: any) => {
        const { id: ngoId, name, brief, kpi } = ngo;

        const [projectId] = await db("project").insert({
          title,
          startDate,
          endDate,
          description,
          objectives,
          category,
          cost,
          scope,
          beneficiary_overview,
          donor_id,
          status: "brief",
          organization_id: ngoId,
        });

        createdProjects.push(projectId);

        await db("brief_kpi").insert({
          brief,
          kpi,
          project_id: projectId,
        });

        await Promise.all(
          beneficiaries.map(async (beneficiary: any) => {
            const { state, city, community } = beneficiary;
            await db("beneficiary").insert({
              project_id: projectId,
              state,
              city,
              community,
            });
          })
        );

        await Promise.all(
          milestones.map(async (milestone: any) => {
            const { milestone: milestoneDesc, target } = milestone;
            await db("milestone").insert({
              project_id: projectId,
              target: target,
              organization_id: ngoId,
              milestone: milestoneDesc,
            });
          })
        );

        if (funds && funds.length > 0) {
          const ngoFunds = funds.filter((fund: any) => fund.ngo_id === ngoId);
          await Promise.all(
            ngoFunds.map(async (fund: any) => {
              const { ngo_id, amount } = fund;
              await db("donations").insert({
                project_id: projectId,
                type: "allocated",
                ngo_id: ngo_id,
                donor_id: donor_id,
                amount: parseFloat(amount),
              });
              await db("project")
                .where({ id: projectId })
                .update({ allocated: parseFloat(amount) });
            })
          );
        }
        let userData = await db("organizations").where("id", ngoId).first();
        let userData2 = await db("users").where("id", userData.user_id).first();
        const ngoEmail = userData2.email;
        const fundingAmount = funds
          .filter((fund: any) => fund.ngo_id === ngoId)
          .reduce((acc: any, fund: any) => acc + parseFloat(fund.amount), 0);
        const currency = "NGN";

        const ngoAdditionalData = {
          donorName,
          ngoName: userData.name,
          projectTitle: title,
          projectDescription: description,
          fundingAmount,
          currency,
        };
        await new Email({
          email: ngoEmail,
          url: "",
          token: 0,
          additionalData: ngoAdditionalData,
        }).sendEmail("donorbriefngo", "New Project assigned");
      })
    );

    // Deduct the total fund amount from the user's wallet
    await db("wallet")
      .where({ user_id: userId })
      .decrement("balance", totalFunds);

    await transaction.commit();

    const adminEmail = "info@givingbackng.org";

    const adminAdditionalData = {
      donorName,
      projectTitle: title,
      projectDescription: description,
      fundingAmount: totalFunds,
      currency: "NGN",
    };

    const token = 0;
    const url = "name";

    await new Email({
      email: adminEmail,
      url,
      token,
      additionalData: adminAdditionalData,
    }).sendEmail("admindonorbriefngo", "New Project assigned");

    res.status(201).json({ message: "Briefs created successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating projects:", error);
    res.status(500).json({ error: "Unable to create projects" });
  }
};

export const getMessage = async (
  req: any,
  res: any,
  next: NextFunction
): Promise<void> => {
  try {
    const { user_id, sender_type } = req.query;

    let query = db("messages");

    if (user_id) {
      query = query.where("user_id", user_id);
    }
    if (sender_type) {
      query = query.where("sender_type", sender_type);
    }

    const messages = await query;
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateMessage = async (
  req: any,
  res: any,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const updatedMessage = await db("messages")
      .where({ id })
      .update({ is_read: 1 });

    if (updatedMessage) {
      res.json({ message: "Message marked as read" });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const sendMessageToAdmin = async (
  req: any,
  res: any,
  next: NextFunction
): Promise<void> => {
  try {
    const { subject, message, sender_type } = req.body;

    await db("messages").insert({
      subject,
      message,
      sender_id: req.user.id,
      sender_type,
    });

    res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};
