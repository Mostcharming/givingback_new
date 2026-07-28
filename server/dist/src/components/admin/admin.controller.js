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
exports.createProject = exports.getAllDonors = exports.getPaymentGateways = exports.addRates = exports.getRates = exports.deletePaymentGateway = exports.updatePaymentGateway = exports.addPaymentGateway = exports.updateProject = exports.feedBack = exports.getDonations = exports.bulk = exports.sample = exports.updateUserByAdmin = exports.getCounts = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const config_1 = __importDefault(require("../../config"));
const getTransac_1 = require("../../helper/getTransac");
const general_1 = require("../../middleware/general");
const mail_1 = __importDefault(require("../../utils/mail"));
const getCounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ngoUsersCount = yield (0, config_1.default)("users")
            .count("id as count")
            .where("role", "NGO")
            .first();
        const projectCount = yield (0, config_1.default)("project").count("id as count").first();
        const donationCount = yield (0, config_1.default)("donations").count("id as count").first();
        res.status(200).json({
            ngoUsersCount: (ngoUsersCount === null || ngoUsersCount === void 0 ? void 0 : ngoUsersCount.count) || 0,
            projectCount: (projectCount === null || projectCount === void 0 ? void 0 : projectCount.count) || 0,
            donationCount: (donationCount === null || donationCount === void 0 ? void 0 : donationCount.count) || 0,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching counts.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getCounts = getCounts;
const updateUserByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const transaction = yield config_1.default.transaction();
    try {
        const { name, phone, website, interest_area, cac, bankName, accountName, accountNumber, state, city_lga, active, address, } = req.body;
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
        const user = yield (0, config_1.default)("organizations").where({ id }).first();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const orgUpdateData = {};
        const addressUpdateData = {};
        const banksUpdateData = {};
        if (userDataToUpdate.name)
            orgUpdateData.name = userDataToUpdate.name;
        if (userDataToUpdate.active !== undefined)
            orgUpdateData.active = userDataToUpdate.active;
        if (userDataToUpdate.phone)
            orgUpdateData.phone = userDataToUpdate.phone;
        if (userDataToUpdate.website)
            orgUpdateData.website = userDataToUpdate.website;
        if (userDataToUpdate.interest_area)
            orgUpdateData.interest_area = userDataToUpdate.interest_area;
        if (userDataToUpdate.cac)
            orgUpdateData.cac = userDataToUpdate.cac;
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
            yield (0, config_1.default)("organizations").where({ id }).update(orgUpdateData);
        }
        if (Object.keys(addressUpdateData).length > 0) {
            yield (0, config_1.default)("address")
                .where({ user_id: user.user_id })
                .update(addressUpdateData);
        }
        if (Object.keys(banksUpdateData).length > 0) {
            yield (0, config_1.default)("banks")
                .where({ user_id: user.user_id })
                .update(banksUpdateData);
        }
        yield transaction.commit();
        res.status(200).json({ message: "User details updated successfully" });
    }
    catch (error) {
        yield transaction.rollback();
        console.error(error); // Log error for debugging
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateUserByAdmin = updateUserByAdmin;
function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
const bulkUploadDonors = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workbook = xlsx_1.default.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx_1.default.utils.sheet_to_json(sheet);
        const donors = rows.filter((row) => row.Name &&
            row.PhoneNumber &&
            row.Email &&
            row.Interest_Area &&
            row.State &&
            row.City_LGA &&
            row.Address &&
            row.Image &&
            row.Website);
        yield config_1.default.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            for (const donor of donors) {
                const mail = donor.Email.trim();
                const generatedPassword = generateRandomPassword(8);
                const password = (0, general_1.hash)(generatedPassword.trim());
                const newUser = {
                    email: mail,
                    password,
                    active: 1,
                    role: "NGO",
                    status: 1,
                    token: 0,
                };
                const [id] = yield trx("users").insert(newUser).returning("id");
                yield trx("organizations").insert({
                    name: donor.Name,
                    phone: donor.PhoneNumber,
                    website: donor.Website,
                    interest_area: donor.Interest_Area,
                    user_id: id,
                });
                yield trx("address").insert({
                    city_lga: donor.City_LGA,
                    state: donor.State,
                    address: donor.Address,
                    user_id: id,
                });
                yield trx("userimg").insert({
                    filename: donor.Image,
                    user_id: id,
                });
                // const emailService = new Email(mail, '', generatedPassword)
                // await emailService.sendWelcomeNGO()
            }
        }));
        return { success: true, message: "Bulk upload successful" };
    }
    catch (error) {
        console.error("Error occurred during bulk upload:", error);
        return { success: false, error: `Unable to perform bulk upload: ${error}` };
    }
});
const sample = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workbook = xlsx_1.default.utils.book_new();
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
        const sheet = xlsx_1.default.utils.aoa_to_sheet(sampleData);
        xlsx_1.default.utils.book_append_sheet(workbook, sheet, "Sample Donors");
        const buffer = xlsx_1.default.write(workbook, { type: "buffer" });
        res.setHeader("Content-Disposition", "attachment; filename=sample_ngos_bulk.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(Buffer.from(buffer));
        // res.status(200).json(output)
    }
    catch (error) {
        console.error("Error generating sample file:", error);
        res.status(500).json({ error: "Unable to fetch data" });
    }
});
exports.sample = sample;
const bulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file || !req.file.buffer) {
            res.status(400).json({ error: "File is required" });
            return;
        }
        const fileBuffer = req.file.buffer;
        const result = yield bulkUploadDonors(fileBuffer);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json({ error: result.error });
        }
    }
    catch (error) {
        console.error("Error in bulk upload route:", error);
        res.status(500).json({ error: "Unable to upload data" });
    }
});
exports.bulk = bulk;
const getDonations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract filters from query parameters
        const { page, limit, project_id, ngo_id, donor_id, type, min_amount, max_amount, payment_gateway, status, } = req.query;
        // Fetch donations using the helper function
        const result = yield (0, getTransac_1.fetchDonations)({
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            project_id: project_id ? parseInt(project_id, 10) : undefined,
            ngo_id: ngo_id ? parseInt(ngo_id, 10) : undefined,
            donor_id: donor_id ? parseInt(donor_id, 10) : undefined,
            type: type,
            min_amount: min_amount ? parseFloat(min_amount) : undefined,
            max_amount: max_amount ? parseFloat(max_amount) : undefined,
            payment_gateway: payment_gateway,
            status: status,
        });
        // Return the result
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ message: "Failed to fetch donations", error });
    }
});
exports.getDonations = getDonations;
const feedBack = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        if (!id || !comment) {
            res.status(400).json({ error: "Project ID and comment are required" });
            return;
        }
        yield (0, config_1.default)("admin_feedback").insert({
            project_id: id,
            feedback: comment,
        });
        res.status(201).json({ message: "Comment Submitted" });
    }
    catch (error) {
        console.error("Error creating projects:", error);
        res.status(500).json({ error: "Unable to submit comment" });
    }
});
exports.feedBack = feedBack;
const updateProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield config_1.default.transaction();
    try {
        const projectId = req.params.id;
        const { status } = req.body;
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
        yield (0, config_1.default)("previousprojects").where({ id: projectId }).update({
            status,
        });
        // Uncomment and type further logic if required, e.g., sponsors or beneficiaries updates
        yield transaction.commit();
        res.status(200).json({ message: "Previous Project updated successfully" });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Unable to update project" });
    }
});
exports.updateProject = updateProject;
const addPaymentGateway = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, publicKey, category, secretKey, status } = req.body;
    try {
        const [id] = yield (0, config_1.default)("payment_gateways").insert({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add payment gateway" });
    }
});
exports.addPaymentGateway = addPaymentGateway;
// Update a payment gateway
const updatePaymentGateway = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, publicKey, category, secretKey, status } = req.body;
    try {
        const updatedRows = yield (0, config_1.default)("payment_gateways").where({ id }).update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update payment gateway" });
    }
});
exports.updatePaymentGateway = updatePaymentGateway;
// Delete a payment gateway
const deletePaymentGateway = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedRows = yield (0, config_1.default)("payment_gateways").where({ id }).del();
        if (deletedRows === 0) {
            res.status(404).json({ error: "Payment gateway not found" });
            return;
        }
        res.status(200).json({ message: "Payment gateway deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete payment gateway" });
    }
});
exports.deletePaymentGateway = deletePaymentGateway;
// Get the latest rate
const getRates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestRate = yield (0, config_1.default)("rates").orderBy("updated_at", "desc").first();
        res.json(latestRate || { rate: 0 });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch payment gateways" });
    }
});
exports.getRates = getRates;
// Add rates
const addRates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rate, mode } = req.body;
    try {
        yield (0, config_1.default)("rates").del();
        yield (0, config_1.default)("rates").insert({ rate, mode });
        res.send("Rate saved successfully.");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add rates" });
    }
});
exports.addRates = addRates;
const getPaymentGateways = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield (0, config_1.default)("payment_gateways").select("*");
        res.status(200).json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch payment gateways" });
    }
});
exports.getPaymentGateways = getPaymentGateways;
const getAllDonors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, industry, interest_area, state, city_lga } = req.query;
        let query = (0, config_1.default)("donors")
            .select("id", "name", "phoneNumber", "industry", "email", "interest_area", "state", "city_lga", "address", "about", "image")
            .orderBy("createdAt", "desc");
        if (name) {
            query = query.where(config_1.default.raw("LOWER(name)"), "=", name.toLowerCase());
        }
        if (industry) {
            query = query.where(config_1.default.raw("LOWER(industry)"), "LIKE", `%${industry.toLowerCase()}%`);
        }
        if (interest_area) {
            query = query.where(config_1.default.raw("LOWER(interest_area)"), "LIKE", `%${interest_area.toLowerCase()}%`);
        }
        if (state) {
            query = query.where(config_1.default.raw("LOWER(state)"), "LIKE", `%${state.toLowerCase()}%`);
        }
        if (city_lga) {
            query = query.where(config_1.default.raw("LOWER(city_lga)"), "LIKE", `%${city_lga.toLowerCase()}%`);
        }
        const allDonors = yield query;
        res.status(200).json({
            donors: allDonors,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Unable to fetch donors" });
    }
});
exports.getAllDonors = getAllDonors;
const createProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield config_1.default.transaction();
    try {
        const { title, 
        // sponsor,
        // sponsor_about,
        startDate, endDate, description, objectives, category, cost, scope, beneficiary_overview, beneficiaries, milestones, donor_id, ngos, funds, } = req.body;
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
        // if (!cost) missingFields.push('cost')
        if (!scope)
            missingFields.push("scope");
        if (!beneficiary_overview)
            missingFields.push("beneficiary_overview");
        if (!beneficiaries || beneficiaries.length === 0)
            missingFields.push("beneficiaries");
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
        const createdProjects = [];
        let ngoName = "";
        yield Promise.all(ngos.map((ngo) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: ngoId, name, brief, kpi } = ngo;
            const [projectId] = yield (0, config_1.default)("project").insert({
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
            yield (0, config_1.default)("brief_kpi").insert({
                // name,
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
                        amount,
                    });
                    yield (0, config_1.default)("project")
                        .where({ id: projectId })
                        .update({ allocated: amount });
                })));
            }
            let userData = yield (0, config_1.default)("organizations").where("id", ngoId).first();
            if (userData) {
                ngoName += `${userData.name}, `;
            }
            let userData2 = yield (0, config_1.default)("users").where("id", userData.user_id).first();
            const donor2 = yield (0, config_1.default)("donors").where({ id: donor_id }).first();
            const donorName = donor2.name;
            yield new mail_1.default({
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
        })));
        yield transaction.commit();
        const donor2 = yield (0, config_1.default)("donors").where({ id: donor_id }).first();
        const donor = yield (0, config_1.default)("users").where({ id: donor2.user_id }).first();
        const donorName = donor2.name;
        const adminAdditionalData = {
            donorName,
            projectTitle: title,
            projectDescription: description,
            ngoName,
        };
        const token = 0;
        const url = "name";
        yield new mail_1.default({
            email: donor.email,
            url,
            token,
            additionalData: adminAdditionalData,
        }).sendEmail("adminbriefngodonor", "New Project assigned");
        res.status(201).json({ message: "Briefs created successfully" });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Error creating projects:", error);
        // res.status(500).json({ error: "Unable to create projects" });
    }
});
exports.createProject = createProject;
