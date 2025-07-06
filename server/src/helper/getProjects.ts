import { Knex } from "knex";
import { ProjectFilter } from "../interfaces";

export const getProjects = async (
  db: Knex,
  filters: ProjectFilter,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;
  const { projectType, donor_id, organization_id, ...searchFilters } = filters;

  // Base queries for present and previous projects
  let previousProjectsQuery = db("previousprojects")
    .select(
      "id",
      "title",
      "category",
      "cost",
      "duration",
      "status",
      "raised",
      "description",
      "createdAt",
      "updatedAt",
      "organization_id"
    )
    .orderBy("createdAt", "desc");

  let presentProjectsQuery = db("project")
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
      "updatedAt",
      "organization_id"
    )
    .orderBy("createdAt", "desc");

  // Filtering by project type
  if (projectType === "previous") {
    presentProjectsQuery = db("project").whereRaw("false");
  } else if (projectType === "present") {
    previousProjectsQuery = db("previousprojects").whereRaw("false");
  }

  // Apply search filters
  for (const [key, value] of Object.entries(searchFilters)) {
    if (value) {
      const searchFields = [
        "title",
        "description",
        "objectives",
        "category",
        "scope",
        "id",
      ];
      if (searchFields.includes(key)) {
        previousProjectsQuery = previousProjectsQuery.where(
          db.raw(`LOWER(${key})`),
          "LIKE",
          `%${(value as string).toLowerCase()}%`
        );
        presentProjectsQuery = presentProjectsQuery.where(
          db.raw(`LOWER(${key})`),
          "LIKE",
          `%${(value as string).toLowerCase()}%`
        );
      } else if (key === "status") {
        previousProjectsQuery = previousProjectsQuery.where(
          db.raw("LOWER(status)"),
          "=",
          (value as string).toLowerCase()
        );
        presentProjectsQuery = presentProjectsQuery.where(
          db.raw("LOWER(status)"),
          "=",
          (value as string).toLowerCase()
        );
      } else if (key === "startDate" || key === "endDate") {
        presentProjectsQuery = presentProjectsQuery.where(
          key,
          key === "startDate" ? ">=" : "<=",
          value
        );
      }
    }
  }

  // Additional filtering by donor_id and organization_id
  if (donor_id) {
    presentProjectsQuery = presentProjectsQuery.where({ donor_id });
  }
  if (organization_id) {
    previousProjectsQuery = previousProjectsQuery.where({ organization_id });
    presentProjectsQuery = presentProjectsQuery.where({ organization_id });
  }

  // Limit and offset for pagination
  previousProjectsQuery = previousProjectsQuery.limit(limit).offset(offset);
  presentProjectsQuery = presentProjectsQuery.limit(limit).offset(offset);

  // Fetch data
  const previousProjects = await previousProjectsQuery;
  const presentProjects = await presentProjectsQuery;

  // Fetch related data for projects
  const previousProjectsWithDetails = await Promise.all(
    previousProjects.map(async (project) => {
      const projectId = project.id;

      // Fetch related details for previous projects

      const sponsors = await db("previousprojects_sponsors")
        .where({ project_id: projectId })
        .select("name", "image", "description");

      const beneficiaries = await db("previousprojects_beneficiaries")
        .where({ project_id: projectId })
        .select("name", "contact", "location");

      const projectImages = await db("previousprojects_images")
        .where({ project_id: projectId })
        .select("image");

      return {
        ...project,
        projectType: "previous",
        sponsors,
        beneficiaries,
        projectImages,
      };
    })
  );

  const presentProjectsWithDetails = await Promise.all(
    presentProjects.map(async (project) => {
      const projectId = project.id;

      // Fetch related details for present projects
      const donorDetails = await db("donors")
        .where({ id: project.donor_id })
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

      const milestones = await db("milestone")
        .where({ project_id: projectId })
        .select(
          "id",
          "milestone",
          "target",
          "description",
          "status",
          "createdAt"
        );

      const sponsors = await db("project_sponsor")
        .where({ project_id: projectId })
        .select("name", "image", "description");

      const detailedMilestones = await Promise.all(
        milestones.map(async (milestone) => {
          const updates = await db("milestone_update")
            .where({ milestone_id: milestone.id })
            .select(
              "achievement",
              "position",
              "image",
              "status",
              "narration",
              "createdAt"
            );
          return { ...milestone, updates };
        })
      );

      const beneficiaries = await db("beneficiary")
        .where({ project_id: projectId })
        .select("state", "city", "community", "contact");

      const projectImages = await db("project_images")
        .where({ project_id: projectId })
        .select("image");

      return {
        ...project,
        projectType: "present",
        donor: donorDetails,
        milestones: detailedMilestones,
        beneficiaries,
        sponsors,
        projectImages,
      };
    })
  );

  return {
    previousProjects: previousProjectsWithDetails,
    presentProjects: presentProjectsWithDetails,
  };
};
