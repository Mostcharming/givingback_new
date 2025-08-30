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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToAdmin = exports.updateMessage = exports.getMessage = exports.addbrief = exports.getAllUserPresentProjects = exports.donate = exports.getRecipient = exports.addRecipient = exports.feedBack = exports.sendMessageToNGO = exports.getAllUsers = exports.newDonor = exports.getCountsHandler = void 0;
const config_1 = __importDefault(require("../../config"));
const dash_1 = require("../../helper/dash");
const getusers_1 = require("../../helper/getusers");
const mail_1 = __importDefault(require("../../utils/mail"));
const getCountsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const donor = yield (0, config_1.default)("donors")
            .where({ user_id: userId })
            .select("id")
            .first();
        let isDonor = !!donor;
        let orgId;
        if (!donor) {
            const organization = yield (0, config_1.default)("organizations")
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
        const counts = yield (0, dash_1.getCounts)(userId, isDonor, orgId);
        res.status(200).json(counts);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to fetch dashboard data" });
    }
});
exports.getCountsHandler = getCountsHandler;
const newDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield config_1.default.transaction();
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Fetch user data
        const userData = yield (0, config_1.default)("users").where("id", user_id).first();
        if (!userData) {
            return res.status(404).json({
                status: "fail",
                message: "User not found.",
            });
        }
        const email = userData.email;
        // Destructure required fields from request body
        const { name, phoneNumber, industry, interest_area, state, city_lga, address, about, } = req.body;
        // Validate missing fields
        const missingFields = [];
        if (!name)
            missingFields.push("name");
        if (!phoneNumber)
            missingFields.push("phoneNumber");
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: "fail",
                error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
        }
        const additionalFields = Object.assign({}, req.body);
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
        const [donorId] = yield (0, config_1.default)("donors").insert({
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
        const newDonor = yield (0, config_1.default)("donors").where("id", donorId).first();
        yield (0, config_1.default)("users").where("id", user_id).update({
            role: "donor",
            status: 1,
            token: 0,
        });
        yield transaction.commit();
        //email
        const token = 0;
        const url = name;
        const additionalData = { role: "Donor" };
        yield new mail_1.default({ email: email, url, token, additionalData }).sendEmail("donoronboard", "Welcome to the GivingBack Family!");
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url,
            token,
            additionalData,
        }).sendEmail("adminonb", "New user");
        res.status(201).json({
            message: "Donor created successfully",
            donor: newDonor,
        });
    }
    catch (error) {
        yield transaction.rollback();
        console.error(error);
        res.status(500).json({
            error: "Unable to create donor",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.newDonor = newDonor;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, getusers_1.fetchUsers)(req.query);
        res.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllUsers = getAllUsers;
const sendMessageToNGO = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const ngoId = req.params.id;
        const { subject, message } = req.body;
        const org = yield (0, config_1.default)("organizations").where("id", ngoId).first();
        if (!org) {
            return res.status(404).json({
                message: "NGO not found",
            });
        }
        const newDonor = yield (0, config_1.default)("messages").insert({
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
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to send message",
            error: error.message,
        });
    }
});
exports.sendMessageToNGO = sendMessageToNGO;
const feedBack = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        if (!id || !comment) {
            res.status(400).json({ error: "Project ID and comment are required" });
            return;
        }
        yield (0, config_1.default)("donor_comment").insert({
            project_id: id,
            comment: comment,
        });
        res.status(201).json({ message: "Comment Submitted" });
    }
    catch (error) {
        console.error("Error creating projects:", error);
        res.status(500).json({ error: "Unable to submit comment" });
    }
});
exports.feedBack = feedBack;
const addRecipient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ngoId, name, donorId, } = req.body;
    try {
        // Check if the recipient already exists
        const existingRecipient = yield (0, config_1.default)("donor_beneficiary")
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
        const [newRecipient] = yield (0, config_1.default)("donor_beneficiary").insert({
            ngo_id: ngoId,
            name: name,
            donor_id: donorId,
        }, ["id"]);
        res.status(201).json(newRecipient);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating recipient", error });
    }
});
exports.addRecipient = addRecipient;
// GetRecipient
const getRecipient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donor = yield (0, config_1.default)("donors")
            .where({ user_id: req.user.id })
            .select("id")
            .first();
        if (!donor) {
            return res.status(404).json({ message: "Donor not found." });
        }
        const ngoIds = yield (0, config_1.default)("donor_beneficiary")
            .select("ngo_id")
            .where("donor_id", donor.id);
        if (ngoIds.length === 0) {
            return res
                .status(404)
                .json({ message: "No NGOs found for this donor ID." });
        }
        const ids = ngoIds.map((ngo) => ngo.ngo_id);
        const ngosWithAddresses = yield (0, config_1.default)("organizations as org")
            .select("org.*", "addr.*")
            .leftJoin("address as addr", "org.user_id", "addr.user_id")
            .whereIn("org.id", ids);
        return res.json(ngosWithAddresses);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching NGOs.", error });
    }
});
exports.getRecipient = getRecipient;
// Donate
const donate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trx = yield config_1.default.transaction();
    try {
        const { amount, project_id, ngo_id, donor_id, type = "Donated", } = req.body;
        const donationAmount = parseFloat(amount);
        const wallet = yield trx("wallet").where("user_id", donor_id).first();
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
        yield trx("wallet")
            .where("user_id", donor_id)
            .update({ balance: updatedBalance });
        const dono = yield trx("donors")
            .where({ user_id: donor_id })
            .select("id")
            .first();
        const [donationId] = yield trx("donations").insert({
            amount,
            project_id,
            ngo_id,
            donor_id: dono === null || dono === void 0 ? void 0 : dono.id,
            type,
        }, ["id"]);
        const ngoWallet = yield trx("wallet").where("user_id", ngo_id).first();
        if (!ngoWallet) {
            return res.status(404).json({ message: "Wallet not found for this NGO" });
        }
        const updatedNgoBalance = ngoWallet.balance + donationAmount;
        yield trx("wallet")
            .where("user_id", ngo_id)
            .update({ balance: updatedNgoBalance });
        yield trx.commit();
        //email
        let userData = yield (0, config_1.default)("organizations").where("user_id", ngo_id).first();
        let userData4 = yield (0, config_1.default)("users").where("id", ngo_id).first();
        const userData2 = yield (0, config_1.default)("donors").where("user_id", donor_id).first();
        const userData3 = yield (0, config_1.default)("project").where("id", project_id).first();
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
        yield new mail_1.default({
            email: userData4.email,
            url,
            token,
            additionalData,
        }).sendEmail("receivengo", "Donation Received");
        yield new mail_1.default({ email: email, url, token, additionalData }).sendEmail("donatengo", "Donation Received");
        yield new mail_1.default({
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
    }
    catch (error) {
        yield trx.rollback();
        console.error(error);
        res.status(500).json({ message: "Error adding donation" });
    }
});
exports.donate = donate;
const getAllUserPresentProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Fetch organization by user ID
        const user = yield (0, config_1.default)("organizations")
            .where({ user_id: id })
            .select("id", "name", "phone", "website", "interest_area", "cac", "active", "user_id")
            .first();
        if (!user) {
            res.status(404).json({ error: "User organization not found" });
            return;
        }
        const { page = 1, limit = 10, status, title, startDate, endDate, } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        // Query for projects
        let query = (0, config_1.default)("project")
            .where({ organization_id: user.id })
            .select("id", "title", config_1.default.raw('DATE_FORMAT(startDate, "%Y-%m-%d") AS startDate'), config_1.default.raw('DATE_FORMAT(endDate, "%Y-%m-%d") AS endDate'), "description", "objectives", "category", "donor_id", "cost", "scope", "allocated", "beneficiary_overview", "status", "createdAt", "updatedAt")
            .orderBy("createdAt", "desc");
        // Filter conditions
        if (status) {
            query = query.where(config_1.default.raw("LOWER(status)"), "=", status.toLowerCase());
        }
        if (title) {
            query = query.where(config_1.default.raw("LOWER(title)"), "LIKE", `%${title.toLowerCase()}%`);
        }
        if (startDate) {
            query = query.where("startDate", ">=", startDate);
        }
        if (endDate) {
            query = query.where("endDate", "<=", endDate);
        }
        // Get total items count
        const [totalItems] = yield (0, config_1.default)("project")
            .where({ organization_id: user.id })
            .count("id as total");
        const count = parseInt(totalItems === null || totalItems === void 0 ? void 0 : totalItems.total, 10) || 0;
        const totalPages = Math.ceil(count / Number(limit));
        // Paginate query
        query = query.limit(Number(limit)).offset(offset);
        const userPresentProjects = yield query;
        // Map project details
        const projectsWithDetails = yield Promise.all(userPresentProjects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
            const projectId = project.id;
            const donorId = project.donor_id;
            // Fetch donor details
            const donorDetails = yield (0, config_1.default)("donors")
                .where({ id: donorId })
                .select("name", "phoneNumber", "industry", "email", "interest_area", "state", "city_lga", "address", "about", "image")
                .first();
            // Fetch milestones and updates
            const milestones = yield (0, config_1.default)("milestone")
                .where({ project_id: projectId })
                .select("id", "milestone", "target");
            const outputMilestones = yield Promise.all(milestones.map((milestone) => __awaiter(void 0, void 0, void 0, function* () {
                const updates = yield (0, config_1.default)("milestone_update")
                    .where({ milestone_id: milestone.id })
                    .select("achievement", "position", "status", "narration", "createdAt");
                return {
                    id: milestone.id,
                    milestone: milestone.milestone,
                    target: milestone.target,
                    milestoneUpdates: updates.map((update) => ({
                        achievement: update.achievement,
                        position: update.position,
                        status: update.status,
                        narration: update.narration,
                        createdAt: update.createdAt,
                    })),
                };
            })));
            // Fetch beneficiaries
            const beneficiary = yield (0, config_1.default)("beneficiary")
                .where({ project_id: projectId })
                .select("state", "city", "community", "contact");
            // Fetch project images
            const images = yield (0, config_1.default)("project_images")
                .where({ project_id: projectId })
                .select("id", "image");
            return Object.assign(Object.assign({}, project), { sponsor: donorDetails, milestones: outputMilestones, beneficiary,
                images });
        })));
        // Respond with results
        res.status(200).json({
            projects: projectsWithDetails,
            totalItems: count,
            totalPages,
            currentPage: Number(page),
        });
    }
    catch (error) {
        res.status(500).json({ error: "Unable to fetch user's present projects" });
    }
});
exports.getAllUserPresentProjects = getAllUserPresentProjects;
const addbrief = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield config_1.default.transaction();
    try {
        const userId = req.user.id;
        const { title, startDate, endDate, description, objectives, category, cost, scope, beneficiary_overview, beneficiaries, milestones, donor_id, ngos, funds, } = req.body;
        const missingFields = [];
        if (!title)
            missingFields.push("title");
        if (!startDate)
            missingFields.push("startDate");
        if (!endDate)
            missingFields.push("endDate");
        if (!description)
            missingFields.push("description");
        if (!objectives)
            missingFields.push("objectives");
        if (!category)
            missingFields.push("category");
        if (!milestones || milestones.length === 0)
            missingFields.push("milestones");
        if (!donor_id)
            missingFields.push("donor_id");
        if (!ngos || ngos.length === 0)
            missingFields.push("ngos");
        // If there are any missing fields, return an error response
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: "fail",
                error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
        }
        // Calculate the total fund required by converting the amount to a number
        const totalFunds = funds.reduce((acc, fund) => {
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
        const userWallet = yield (0, config_1.default)("wallet").where({ user_id: userId }).first();
        if (!userWallet || userWallet.balance < totalFunds) {
            return res.status(400).json({
                status: "fail",
                message: "Insufficient balance in wallet to fund the project.",
            });
        }
        //email
        // details
        const donor = yield (0, config_1.default)("donors").where({ id: donor_id }).first();
        const donorName = donor.name;
        // Proceed with project creation
        const createdProjects = [];
        yield Promise.all(ngos.map((ngo) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: ngoId, name, brief, kpi } = ngo;
            const [projectId] = yield (0, config_1.default)("project").insert({
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
            yield (0, config_1.default)("brief_kpi").insert({
                brief,
                kpi,
                project_id: projectId,
            });
            yield Promise.all(beneficiaries.map((beneficiary) => __awaiter(void 0, void 0, void 0, function* () {
                const { state, city, community } = beneficiary;
                yield (0, config_1.default)("beneficiary").insert({
                    project_id: projectId,
                    state,
                    city,
                    community,
                });
            })));
            yield Promise.all(milestones.map((milestone) => __awaiter(void 0, void 0, void 0, function* () {
                const { milestone: milestoneDesc, target } = milestone;
                yield (0, config_1.default)("milestone").insert({
                    project_id: projectId,
                    target: target,
                    organization_id: ngoId,
                    milestone: milestoneDesc,
                });
            })));
            if (funds && funds.length > 0) {
                const ngoFunds = funds.filter((fund) => fund.ngo_id === ngoId);
                yield Promise.all(ngoFunds.map((fund) => __awaiter(void 0, void 0, void 0, function* () {
                    const { ngo_id, amount } = fund;
                    yield (0, config_1.default)("donations").insert({
                        project_id: projectId,
                        type: "allocated",
                        ngo_id: ngo_id,
                        donor_id: donor_id,
                        amount: parseFloat(amount),
                    });
                    yield (0, config_1.default)("project")
                        .where({ id: projectId })
                        .update({ allocated: parseFloat(amount) });
                })));
            }
            let userData = yield (0, config_1.default)("organizations").where("id", ngoId).first();
            let userData2 = yield (0, config_1.default)("users").where("id", userData.user_id).first();
            const ngoEmail = userData2.email;
            const fundingAmount = funds
                .filter((fund) => fund.ngo_id === ngoId)
                .reduce((acc, fund) => acc + parseFloat(fund.amount), 0);
            const currency = "NGN";
            const ngoAdditionalData = {
                donorName,
                ngoName: userData.name,
                projectTitle: title,
                projectDescription: description,
                fundingAmount,
                currency,
            };
            yield new mail_1.default({
                email: ngoEmail,
                url: "",
                token: 0,
                additionalData: ngoAdditionalData,
            }).sendEmail("donorbriefngo", "New Project assigned");
        })));
        // Deduct the total fund amount from the user's wallet
        yield (0, config_1.default)("wallet")
            .where({ user_id: userId })
            .decrement("balance", totalFunds);
        yield transaction.commit();
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
        yield new mail_1.default({
            email: adminEmail,
            url,
            token,
            additionalData: adminAdditionalData,
        }).sendEmail("admindonorbriefngo", "New Project assigned");
        res.status(201).json({ message: "Briefs created successfully" });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Error creating projects:", error);
        res.status(500).json({ error: "Unable to create projects" });
    }
});
exports.addbrief = addbrief;
const getMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, sender_type } = req.query;
        let query = (0, config_1.default)("messages").orderBy("created_at", "desc");
        if (user_id) {
            query = query.where("user_id", user_id);
        }
        if (sender_type) {
            query = query.where("sender_type", sender_type);
        }
        const messages = yield query;
        res.json(messages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMessage = getMessage;
const updateMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedMessage = yield (0, config_1.default)("messages")
            .where({ id })
            .update({ is_read: 1 });
        if (updatedMessage) {
            res.json({ message: "Message marked as read" });
        }
        else {
            res.status(404).json({ error: "Message not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateMessage = updateMessage;
const sendMessageToAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subject, message, sender_type } = req.body;
        yield (0, config_1.default)("messages").insert({
            subject,
            message,
            sender_id: req.user.id,
            sender_type,
        });
        res.status(200).json({
            message: "Message sent successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to send message",
            error: error.message,
        });
    }
});
exports.sendMessageToAdmin = sendMessageToAdmin;
