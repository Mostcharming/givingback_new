import { Response } from "express";
import db from "../../config";
import { User, UserRequest } from "../../interfaces";

/**
 * Create a new project brief
 * POST /project
 *
 * Expected request body:
 * {
 *   title: string;
 *   category: string;
 *   description: string;
 *   budget: string | number; (maps to cost in DB)
 *   deadline: string (YYYY-MM-DD);
 *   state: string;
 *   lga: string (maps to city in DB);
 *   status: string;
 * }
 *
 * donor_id comes from authenticated user context
 */
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

    // Get donor_id from donors table using user_id
    const donor = await db("donors").where({ user_id: userId }).first();

    if (!donor) {
      res.status(400).json({
        status: "fail",
        message: "User is not registered as a donor",
      });
      return;
    }

    const donorId = donor.id;

    // Destructure incoming data from frontend
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

    // Validate required fields
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

    // Validate budget is a valid number
    const cost = parseFloat(String(budget));
    if (isNaN(cost) || cost <= 0) {
      res.status(400).json({
        status: "fail",
        error: "Budget must be a valid positive number",
      });
      return;
    }

    // Validate deadline is a valid date
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      res.status(400).json({
        status: "fail",
        error: "Deadline must be a valid date (YYYY-MM-DD)",
      });
      return;
    }

    // Validate status is one of the allowed values
    const validStatuses = ["draft", "brief", "active", "completed"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        status: "fail",
        error: `Status must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    // Create project record
    const [projectId] = await transaction("project").insert({
      title: title.trim(),
      category,
      description,
      cost,
      deadline: deadline, // Stored as date string YYYY-MM-DD
      state,
      city: lga, // LGA maps to city field
      status,
      donor_id: donorId,
      organization_id: null, // Not specified in brief creation, will be assigned later if needed
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Commit transaction
    await transaction.commit();

    // Fetch the created project
    const createdProject = await db("project").where({ id: projectId }).first();

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
