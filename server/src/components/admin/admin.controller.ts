import { NextFunction, Request, Response } from "express";
import xlsx from "xlsx";
import db from "../../config";
import { fetchDonations } from "../../helper/getTransac";
import { hash } from "../../middleware/general";
import Email from "../../utils/mail";

export const getCounts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ngoUsersCount = await db("users")
      .count("id as count")
      .where("role", "NGO")
      .first();

    const projectCount = await db("project").count("id as count").first();

    const donationCount = await db("donations").count("id as count").first();

    res.status(200).json({
      ngoUsersCount: ngoUsersCount?.count || 0,
      projectCount: projectCount?.count || 0,
      donationCount: donationCount?.count || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching counts.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

interface UpdateUserByAdminRequest extends Request {
  params: {
    id: string;
  };
  body: {
    name?: string;
    phone?: string;
    website?: string;
    interest_area?: string;
    cac?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    state?: string;
    city_lga?: string;
    active?: boolean;
    address?: string;
  };
}

export const updateUserByAdmin = async (
  req: UpdateUserByAdminRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const transaction = await db.transaction();

  try {
    const {
      name,
      phone,
      website,
      interest_area,
      cac,
      bankName,
      accountName,
      accountNumber,
      state,
      city_lga,
      active,
      address,
    } = req.body;

    const userDataToUpdate = {
      name,
      phone,
      website,
      interest_area,
      cac,
      bankName,
      accountName,
      accountNumber,
      state,
      city_lga,
      active,
      address,
    };

    const user = await db("organizations").where({ id }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orgUpdateData: Partial<typeof userDataToUpdate> = {};
    const addressUpdateData: Partial<typeof userDataToUpdate> = {};
    const banksUpdateData: Partial<typeof userDataToUpdate> = {};

    if (userDataToUpdate.name) orgUpdateData.name = userDataToUpdate.name;
    if (userDataToUpdate.active !== undefined)
      orgUpdateData.active = userDataToUpdate.active;

    if (userDataToUpdate.phone) orgUpdateData.phone = userDataToUpdate.phone;
    if (userDataToUpdate.website)
      orgUpdateData.website = userDataToUpdate.website;
    if (userDataToUpdate.interest_area)
      orgUpdateData.interest_area = userDataToUpdate.interest_area;
    if (userDataToUpdate.cac) orgUpdateData.cac = userDataToUpdate.cac;

    if (userDataToUpdate.address)
      addressUpdateData.address = userDataToUpdate.address;
    if (userDataToUpdate.state)
      addressUpdateData.state = userDataToUpdate.state;
    if (userDataToUpdate.city_lga)
      addressUpdateData.city_lga = userDataToUpdate.city_lga;

    if (userDataToUpdate.bankName)
      banksUpdateData.bankName = userDataToUpdate.bankName;
    if (userDataToUpdate.accountName)
      banksUpdateData.accountName = userDataToUpdate.accountName;
    if (userDataToUpdate.accountNumber)
      banksUpdateData.accountNumber = userDataToUpdate.accountNumber;

    if (Object.keys(orgUpdateData).length > 0) {
      await db("organizations").where({ id }).update(orgUpdateData);
    }
    if (Object.keys(addressUpdateData).length > 0) {
      await db("address")
        .where({ user_id: user.user_id })
        .update(addressUpdateData);
    }

    if (Object.keys(banksUpdateData).length > 0) {
      await db("banks")
        .where({ user_id: user.user_id })
        .update(banksUpdateData);
    }

    await transaction.commit();
    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

function generateRandomPassword(length: any) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const bulkUploadDonors = async (fileBuffer: Buffer) => {
  try {
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = xlsx.utils.sheet_to_json(sheet);

    const donors: any[] = rows.filter(
      (row) =>
        row.Name &&
        row.PhoneNumber &&
        row.Email &&
        row.Interest_Area &&
        row.State &&
        row.City_LGA &&
        row.Address &&
        row.Image &&
        row.Website
    );

    await db.transaction(async (trx: any) => {
      for (const donor of donors) {
        const mail = donor.Email.trim();
        const generatedPassword = generateRandomPassword(8);
        const password = hash(generatedPassword.trim());
        const newUser = {
          email: mail,
          password,
          active: 1,
          role: "NGO",
          status: 1,
          token: 0,
        };

        const [id] = await trx("users").insert(newUser).returning("id");

        await trx("organizations").insert({
          name: donor.Name,
          phone: donor.PhoneNumber,
          website: donor.Website,
          interest_area: donor.Interest_Area,
          user_id: id,
        });

        await trx("address").insert({
          city_lga: donor.City_LGA,
          state: donor.State,
          address: donor.Address,
          user_id: id,
        });

        await trx("userimg").insert({
          filename: donor.Image,
          user_id: id,
        });

        // const emailService = new Email(mail, '', generatedPassword)
        // await emailService.sendWelcomeNGO()
      }
    });

    return { success: true, message: "Bulk upload successful" };
  } catch (error) {
    console.error("Error occurred during bulk upload:", error);
    return { success: false, error: `Unable to perform bulk upload: ${error}` };
  }
};

export const sample = async (req: Request, res: Response): Promise<void> => {
  try {
    const workbook = xlsx.utils.book_new();
    const sampleData = [
      [
        "Name",
        "PhoneNumber",
        "Email",
        "Interest_Area",
        "State",
        "City_LGA",
        "Address",
        "Image",
        "Website",
      ],
      [
        "John Doe",
        "1234567890",
        "johndoe@example.com",
        "Education,Art,Welfare",
        "California",
        "Los Angeles",
        "123 Main St",
        "https://mayowafadeni.vercel.app/may.jpg",
        "https://sample.com",
      ],
    ];

    const sheet = xlsx.utils.aoa_to_sheet(sampleData);
    xlsx.utils.book_append_sheet(workbook, sheet, "Sample Donors");

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
    // res.status(200).json(output)
  } catch (error) {
    console.error("Error generating sample file:", error);
    res.status(500).json({ error: "Unable to fetch data" });
  }
};

export const bulk = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).json({ error: "File is required" });
      return;
    }

    const fileBuffer = req.file.buffer;
    const result = await bulkUploadDonors(fileBuffer);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in bulk upload route:", error);
    res.status(500).json({ error: "Unable to upload data" });
  }
};

export const getDonations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract filters from query parameters
    const {
      page,
      limit,
      project_id,
      ngo_id,
      donor_id,
      type,
      min_amount,
      max_amount,
      payment_gateway,
      status,
    } = req.query;

    // Fetch donations using the helper function
    const result = await fetchDonations({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      project_id: project_id ? parseInt(project_id as string, 10) : undefined,
      ngo_id: ngo_id ? parseInt(ngo_id as string, 10) : undefined,
      donor_id: donor_id ? parseInt(donor_id as string, 10) : undefined,
      type: type as string,
      min_amount: min_amount ? parseFloat(min_amount as string) : undefined,
      max_amount: max_amount ? parseFloat(max_amount as string) : undefined,
      payment_gateway: payment_gateway as string,
      status: status as string,
    });

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Failed to fetch donations", error });
  }
};

export const feedBack = async (
  req: Request,
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

    await db("admin_feedback").insert({
      project_id: id,
      feedback: comment,
    });

    res.status(201).json({ message: "Comment Submitted" });
  } catch (error) {
    console.error("Error creating projects:", error);
    res.status(500).json({ error: "Unable to submit comment" });
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const transaction = await db.transaction();
  try {
    const projectId = req.params.id as string;

    const { status }: { status?: string } = req.body;

    if (!projectId) {
      res
        .status(400)
        .json({ status: "fail", error: "Project ID is required." });
      return;
    }
    if (status === undefined) {
      // Check if status is explicitly provided
      res.status(400).json({ status: "fail", error: "Status is required." });
      return;
    }

    // Update the project in the database
    await db("previousprojects").where({ id: projectId }).update({
      status,
    });

    // Uncomment and type further logic if required, e.g., sponsors or beneficiaries updates

    await transaction.commit();
    res.status(200).json({ message: "Previous Project updated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Unable to update project" });
  }
};

export const addPaymentGateway = async (
  req: any,
  res: Response
): Promise<void> => {
  const { name, publicKey, category, secretKey, status } = req.body;

  try {
    const [id] = await db("payment_gateways").insert({
      name,
      public_key: publicKey,
      secret_key: secretKey,
      category,
      status,
    });

    res.status(201).json({
      id,
      name,
      public_key: publicKey,
      secret_key: secretKey,
      category,
      status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add payment gateway" });
  }
};

// Update a payment gateway
export const updatePaymentGateway = async (
  req: any,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, publicKey, category, secretKey, status } = req.body;

  try {
    const updatedRows = await db("payment_gateways").where({ id }).update({
      name,
      public_key: publicKey,
      secret_key: secretKey,
      category,
      status,
    });

    if (updatedRows === 0) {
      res.status(404).json({ error: "Payment gateway not found" });
      return;
    }

    res.status(200).json({
      id,
      name,
      public_key: publicKey,
      secret_key: secretKey,
      category,
      status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update payment gateway" });
  }
};

// Delete a payment gateway
export const deletePaymentGateway = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedRows = await db("payment_gateways").where({ id }).del();

    if (deletedRows === 0) {
      res.status(404).json({ error: "Payment gateway not found" });
      return;
    }

    res.status(200).json({ message: "Payment gateway deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete payment gateway" });
  }
};

// Get the latest rate
export const getRates = async (req: Request, res: Response): Promise<void> => {
  try {
    const latestRate = await db("rates").orderBy("updated_at", "desc").first();
    res.json(latestRate || { rate: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch payment gateways" });
  }
};

// Add rates
export const addRates = async (req: any, res: Response): Promise<void> => {
  const { rate, mode } = req.body;

  try {
    await db("rates").del();
    await db("rates").insert({ rate, mode });
    res.send("Rate saved successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add rates" });
  }
};

export const getPaymentGateways = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const rows = await db("payment_gateways").select("*");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch payment gateways" });
  }
};

export const getAllDonors = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, industry, interest_area, state, city_lga } = req.query;

    let query = db("donors").select(
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
      "image"
    );

    if (name) {
      query = query.where(db.raw("LOWER(name)"), "=", name.toLowerCase());
    }
    if (industry) {
      query = query.where(
        db.raw("LOWER(industry)"),
        "LIKE",
        `%${industry.toLowerCase()}%`
      );
    }
    if (interest_area) {
      query = query.where(
        db.raw("LOWER(interest_area)"),
        "LIKE",
        `%${interest_area.toLowerCase()}%`
      );
    }
    if (state) {
      query = query.where(
        db.raw("LOWER(state)"),
        "LIKE",
        `%${state.toLowerCase()}%`
      );
    }
    if (city_lga) {
      query = query.where(
        db.raw("LOWER(city_lga)"),
        "LIKE",
        `%${city_lga.toLowerCase()}%`
      );
    }

    const allDonors = await query;

    res.status(200).json({
      donors: allDonors,
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch donors" });
  }
};

export const createProject = async (
  req: any,
  res: any,
  next: NextFunction
): Promise<void> => {
  const transaction = await db.transaction();

  try {
    const {
      title,
      // sponsor,
      // sponsor_about,
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
    // if (!cost) missingFields.push('cost')
    if (!scope) missingFields.push("scope");
    if (!beneficiary_overview) missingFields.push("beneficiary_overview");
    if (!beneficiaries || beneficiaries.length === 0)
      missingFields.push("beneficiaries");
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

    const createdProjects = [];
    let ngoName = "";
    await Promise.all(
      ngos.map(async (ngo: any) => {
        const { id: ngoId, name, brief, kpi } = ngo;

        const [projectId] = await db("project").insert({
          title,
          // sponsor,
          // sponsor_about,
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
          // name,
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
                amount,
              });
              await db("project")
                .where({ id: projectId })
                .update({ allocated: amount });
            })
          );
        }

        let userData = await db("organizations").where("id", ngoId).first();
        if (userData) {
          ngoName += `${userData.name}, `;
        }

        let userData2 = await db("users").where("id", userData.user_id).first();
        const donor2 = await db("donors").where({ id: donor_id }).first();
        const donorName = donor2.name;

        await new Email({
          email: userData2.email,
          url,
          token,
          additionalData: {
            projectTitle: title,
            projectDescription: description,
            ngoName: userData.name,
            donorName,
          },
        }).sendEmail("adminbriefngo", "New Project assigned");
      })
    );
    await transaction.commit();

    const donor2 = await db("donors").where({ id: donor_id }).first();
    const donor = await db("users").where({ id: donor2.user_id }).first();

    const donorName = donor2.name;

    const adminAdditionalData = {
      donorName,
      projectTitle: title,
      projectDescription: description,

      ngoName,
    };

    const token = 0;
    const url = "name";

    await new Email({
      email: donor.email,
      url,
      token,
      additionalData: adminAdditionalData,
    }).sendEmail("adminbriefngodonor", "New Project assigned");

    res.status(201).json({ message: "Briefs created successfully" });
  } catch (error) {
    await transaction.rollback();

    console.error("Error creating projects:", error);
    res.status(500).json({ error: "Unable to create projects" });
  }
};
