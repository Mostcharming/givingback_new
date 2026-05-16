"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = void 0;
const getProjects = (db_1, filters_1, ...args_1) => __awaiter(void 0, [db_1, filters_1, ...args_1], void 0, function* (db, filters, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { projectType, donor_id, organization_id } = filters, searchFilters = __rest(filters, ["projectType", "donor_id", "organization_id"]);
    // Base queries for present and previous projects
    let previousProjectsQuery = db("previousprojects")
        .select("id", "title", "category", "cost", "duration", "status", "raised", "description", "createdAt", "updatedAt", "organization_id")
        .orderBy("createdAt", "desc");
    let presentProjectsQuery = db("project")
        .select("id", "title", db.raw('DATE_FORMAT(startDate, "%Y-%m-%d") AS startDate'), db.raw('DATE_FORMAT(endDate, "%Y-%m-%d") AS endDate'), "description", "objectives", "category", "donor_id", "cost", "scope", "allocated", "beneficiary_overview", "status", "createdAt", "updatedAt", "organization_id")
        .orderBy("createdAt", "desc");
    // Filtering by project type
    if (projectType === "previous") {
        presentProjectsQuery = db("project").whereRaw("false");
    }
    else if (projectType === "present") {
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
                previousProjectsQuery = previousProjectsQuery.where(db.raw(`LOWER(${key})`), "LIKE", `%${value.toLowerCase()}%`);
                presentProjectsQuery = presentProjectsQuery.where(db.raw(`LOWER(${key})`), "LIKE", `%${value.toLowerCase()}%`);
            }
            else if (key === "status") {
                previousProjectsQuery = previousProjectsQuery.where(db.raw("LOWER(status)"), "=", value.toLowerCase());
                presentProjectsQuery = presentProjectsQuery.where(db.raw("LOWER(status)"), "=", value.toLowerCase());
            }
            else if (key === "startDate" || key === "endDate") {
                presentProjectsQuery = presentProjectsQuery.where(key, key === "startDate" ? ">=" : "<=", value);
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
    const previousProjects = yield previousProjectsQuery;
    const presentProjects = yield presentProjectsQuery;
    // Fetch related data for projects
    const previousProjectsWithDetails = yield Promise.all(previousProjects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
        const projectId = project.id;
        // Fetch related details for previous projects
        const sponsors = yield db("previousprojects_sponsors")
            .where({ project_id: projectId })
            .select("id", "name", "image", "description");
        const beneficiaries = yield db("previousprojects_beneficiaries")
            .where({ project_id: projectId })
            .select("id", "name", "contact", "location");
        const projectImages = yield db("previousprojects_images")
            .where({ project_id: projectId })
            .select("id", "image");
        return Object.assign(Object.assign({}, project), { projectType: "previous", sponsors,
            beneficiaries,
            projectImages });
    })));
    const presentProjectsWithDetails = yield Promise.all(presentProjects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
        const projectId = project.id;
        // Fetch related details for present projects
        const donorDetails = yield db("donors")
            .where({ id: project.donor_id })
            .select("id", "name", "phoneNumber", "industry", "email", "interest_area", "state", "city_lga", "address", "about", "image")
            .first();
        const milestones = yield db("milestone")
            .where({ project_id: projectId })
            .select("id", "milestone", "target", "description", "status", "createdAt");
        const sponsors = yield db("project_sponsor")
            .where({ project_id: projectId })
            .select("id", "name", "image", "description");
        const detailedMilestones = yield Promise.all(milestones.map((milestone) => __awaiter(void 0, void 0, void 0, function* () {
            const updates = yield db("milestone_update")
                .where({ milestone_id: milestone.id })
                .select("id", "achievement", "position", "image", "status", "narration", "createdAt");
            return Object.assign(Object.assign({}, milestone), { updates });
        })));
        const beneficiaries = yield db("beneficiary")
            .where({ project_id: projectId })
            .select("id", "state", "city", "community", "contact");
        const projectImages = yield db("project_images")
            .where({ project_id: projectId })
            .select("id", "image");
        return Object.assign(Object.assign({}, project), { projectType: "present", donor: donorDetails, milestones: detailedMilestones, beneficiaries,
            sponsors,
            projectImages });
    })));
    return {
        previousProjects: previousProjectsWithDetails,
        presentProjects: presentProjectsWithDetails,
    };
});
exports.getProjects = getProjects;
