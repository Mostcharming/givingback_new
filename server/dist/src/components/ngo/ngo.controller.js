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
exports.deleteImage = exports.deleteBeneficiary = exports.deleteSponsor = exports.deleteMilestone = exports.addProjectImages = exports.addBeneficiaries = exports.addSponsors = exports.addMilestones = exports.createProject = exports.respondBrief = exports.withdraw = exports.addMilestoneUpdate = exports.createp = exports.create = void 0;
const config_1 = __importDefault(require("../../config"));
const mail_1 = __importDefault(require("../../utils/mail"));
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { name, phone, website, interest_area, cac } = req.body;
        const missingFields = [];
        if (!name)
            missingFields.push("name");
        if (!phone)
            missingFields.push("phone");
        // if (!website) missingFields.push('website');
        if (!interest_area)
            missingFields.push("interest_area");
        if (!cac)
            missingFields.push("cac");
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
        const [id] = yield (0, config_1.default)("organizations").insert(newOrg).returning("id");
        const org = yield (0, config_1.default)("organizations").where({ id }).first();
        const banksDetails = yield (0, config_1.default)("banks")
            .select("bankName", "accountNumber", "accountName")
            .where("user_id", user_id)
            .first();
        const addressDetails = yield (0, config_1.default)("address")
            .select("state", "city_lga", "address")
            .where("user_id", user_id)
            .first();
        const response = {
            Details: org,
            Bank: {
                bank_name: banksDetails === null || banksDetails === void 0 ? void 0 : banksDetails.bankName,
                account_number: banksDetails === null || banksDetails === void 0 ? void 0 : banksDetails.accountNumber,
                account_name: banksDetails === null || banksDetails === void 0 ? void 0 : banksDetails.accountName,
            },
            Address: {
                city: addressDetails === null || addressDetails === void 0 ? void 0 : addressDetails.city_lga,
                state: addressDetails === null || addressDetails === void 0 ? void 0 : addressDetails.state,
                address: addressDetails === null || addressDetails === void 0 ? void 0 : addressDetails.address,
            },
        };
        //email
        const userData = yield (0, config_1.default)("users").where("id", user_id).first();
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
        yield new mail_1.default({ email: email, url, token, additionalData }).sendEmail("donoronboard", "Welcome to the GivingBack Family!");
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url,
            token,
            additionalData,
        }).sendEmail("adminonb", "New User");
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error in create organization:", error);
        res.status(500).json({
            status: "fail",
            message: "An error occurred while creating the organization.",
        });
    }
});
exports.create = create;
const createp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield config_1.default.transaction();
    try {
        const { title, category, duration, description, cost, raised, sponsors, beneficiaries, } = req.body;
        const missingFields = [];
        const userData = yield (0, config_1.default)("organizations")
            .where("user_id", req.user.id)
            .first();
        if (!userData) {
            return res.status(404).json({
                status: "fail",
                message: "User not found.",
            });
        }
        if (!title)
            missingFields.push("title");
        if (!category)
            missingFields.push("category");
        if (!duration)
            missingFields.push("duration");
        if (!description)
            missingFields.push("description");
        if (!cost)
            missingFields.push("cost");
        if (!sponsors)
            missingFields.push("sponsors");
        if (!beneficiaries)
            missingFields.push("beneficiaries");
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
            sponsors.forEach((sponsor, index) => {
                const sponsorImage = req.files.find((file) => file.fieldname === `sponsors[${index}][image]`);
                if (!sponsorImage) {
                    missingFields.push(`sponsors[${index}][image]`);
                }
            });
        }
        const mainImage = req.files.find((file) => file.fieldname === "image");
        if (!mainImage) {
            missingFields.push("image");
        }
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: "fail",
                error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
        }
        const [projectId] = yield (0, config_1.default)("previousprojects")
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
            yield Promise.all(sponsors.map((sponsor, index) => __awaiter(void 0, void 0, void 0, function* () {
                const { name, sponsorDescription } = sponsor;
                const sponsorImage = req.files.find((file) => file.fieldname === `sponsors[${index}][image]`);
                const sponsorData = {
                    project_id: projectId,
                    name: name || "",
                    image: sponsorImage ? sponsorImage.location : "",
                    description: sponsorDescription || "",
                };
                yield (0, config_1.default)("previousprojects_sponsors").insert(sponsorData);
            })));
        }
        if (beneficiaries && beneficiaries.length > 0) {
            yield Promise.all(beneficiaries.map((beneficiary) => __awaiter(void 0, void 0, void 0, function* () {
                const { name, contact, location } = beneficiary;
                const beneficiaryData = {
                    project_id: projectId,
                    name: name || "",
                    contact: contact || "",
                    location: location || "",
                };
                yield (0, config_1.default)("previousprojects_beneficiaries").insert(beneficiaryData);
            })));
        }
        if (req.files && req.files.length > 0) {
            yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                if (file.fieldname === "image") {
                    const filename = file.location;
                    yield (0, config_1.default)("previousprojects_images").insert({
                        image: filename,
                        project_id: projectId,
                    });
                }
            })));
        }
        yield transaction.commit();
        const token = 0;
        const url = "";
        const additionalData = {
            ngoName: userData.name,
            projectTitle: title,
            projectDescription: description,
        };
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url,
            token,
            additionalData,
        }).sendEmail("pastpadmin", "New Past Project");
        res.status(201).json({ message: "Previous Project created successfully" });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Unable to create project" });
    }
});
exports.createp = createp;
const addMilestoneUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { achievement, position, status, narration, milestone_id } = req.body;
        let filename = null;
        const missingFields = [];
        if (!achievement)
            missingFields.push("achievement");
        if (!status)
            missingFields.push("status");
        if (!narration)
            missingFields.push("narration");
        if (!milestone_id)
            missingFields.push("milestone_id");
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            if (req.files[0].fieldname === "image") {
                filename = req.files[0].location;
            }
        }
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: "fail",
                error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
        }
        const [newMilestoneUpdateId] = yield (0, config_1.default)("milestone_update").insert({
            achievement,
            position,
            status,
            narration,
            image: filename,
            milestone_id,
        });
        const newMilestoneUpdate = yield (0, config_1.default)("milestone_update")
            .where({ id: newMilestoneUpdateId })
            .first();
        res.status(201).json({ newMilestoneUpdate });
    }
    catch (error) {
        console.error("Error adding milestone update:", error);
        res.status(500).json({ error: "Unable to add milestone update" });
    }
});
exports.addMilestoneUpdate = addMilestoneUpdate;
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, accountNumber, bank, saveAccount } = req.body;
        const trx = yield config_1.default.transaction();
        let userData = yield (0, config_1.default)("organizations")
            .where("user_id", req.user.id)
            .first();
        let userData1 = yield (0, config_1.default)("users").where("id", req.user.id).first();
        const [donationId] = yield trx("donations")
            .insert({
            amount,
            ngo_id: userData.id,
            type: "Withdrawal Request",
        })
            .returning("id");
        yield trx("transactions").insert({
            donation_id: donationId,
            payment_gateway: "Paystack",
            status: "pending",
        });
        yield trx("donation_messages").insert({
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
            yield trx("banks").insert(newBank);
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
        yield new mail_1.default({
            email: userData1.email,
            url,
            token,
            additionalData,
        }).sendEmail("ngowithdraw", "Withdrawal Request submitted");
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url,
            token,
            additionalData,
        }).sendEmail("adminwithdraw", "New withdrawal Request");
        res.status(201).json({ message: "Request Submitted" });
    }
    catch (error) {
        console.error("Error creating withdrawal request", error);
        res.status(500).json({ error: "Unable to complete process" });
    }
});
exports.withdraw = withdraw;
const respondBrief = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id;
        const { message } = req.body;
        yield (0, config_1.default)("project").where({ id: projectId }).update({
            status: "active",
        });
        const userData3 = yield (0, config_1.default)("project").where("id", projectId).first();
        let userData = yield (0, config_1.default)("organizations")
            .where("user_id", req.user.id)
            .first();
        let userData4 = yield (0, config_1.default)("users").where("id", req.user.id).first();
        const userData2 = yield (0, config_1.default)("donors")
            .where("id", userData3.donor_id)
            .first();
        const userData5 = yield (0, config_1.default)("donations")
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
        yield new mail_1.default({
            email: userData4.email,
            url,
            token,
            additionalData,
        }).sendEmail("ngoaccetpbrief", "Project Acceptance");
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url,
            token,
            additionalData,
        }).sendEmail("adminngoacceptbrief", "Project Acceptance");
        res.status(200).json({ message: "Project accepted" });
    }
    catch (error) {
        res.status(500).json({ error: "Unable to update project" });
    }
});
exports.respondBrief = respondBrief;
//v2
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const trx = yield config_1.default.transaction();
    try {
        const { title, description, status, duration, startDate, endDate, interest_area, orgemail, cost, raised, milestones, sponsors, beneficiaries, } = req.body;
        // const organization = await db("organizations")
        //   .where({ email: orgemail })
        //   .first();
        // if (!organization)
        //   return res.status(404).json({ error: "Organization not found" });
        const organization = yield (0, config_1.default)("organizations")
            .where("user_id", req.user.id)
            .first();
        if (!organization) {
            return res.status(404).json({
                status: "fail",
                message: "User not found.",
            });
        }
        const [project_id] = yield trx("project").insert({
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
            const milestoneData = milestones.map((m) => ({
                milestone: m.milestone,
                status: m.mstatus,
                description: m.miledes,
                target: 0,
                project_id,
                organization_id: organization.id,
            }));
            yield trx("milestone").insert(milestoneData);
        }
        if (sponsors && sponsors.length > 0) {
            const sponsorUploads = Array.isArray(req.files)
                ? req.files.filter((file) => file.fieldname.startsWith("sponsors["))
                : [];
            for (let i = 0; i < sponsors.length; i++) {
                yield trx("project_sponsor").insert({
                    name: sponsors[i].sponsor,
                    image: ((_a = sponsorUploads === null || sponsorUploads === void 0 ? void 0 : sponsorUploads[i]) === null || _a === void 0 ? void 0 : _a.location) || null,
                    description: sponsors[i].sdesc,
                    project_id,
                });
            }
        }
        if (beneficiaries && beneficiaries.length > 0) {
            const beneficiaryData = beneficiaries.map((b) => ({
                state: b.state || "",
                city: b.city || "",
                community: b.address,
                contact: b.contact,
                project_id,
            }));
            yield trx("beneficiary").insert(beneficiaryData);
        }
        const imageUploads = Array.isArray(req.files)
            ? req.files.filter((file) => file.fieldname.startsWith("images["))
            : [];
        if (imageUploads && imageUploads.length > 0) {
            const imageData = imageUploads.map((img) => ({
                image: img.location,
                project_id,
            }));
            yield trx("project_images").insert(imageData);
        }
        yield trx.commit();
        res
            .status(201)
            .json({ message: "Project created successfully", project_id });
    }
    catch (error) {
        yield trx.rollback();
        res.status(500).json({ error: error.message });
    }
});
exports.createProject = createProject;
const addMilestones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project_id } = req.params;
    const { milestones } = req.body;
    const organization = yield (0, config_1.default)("organizations")
        .where("user_id", req.user.id)
        .first();
    if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
    }
    const milestoneData = milestones.map((m) => ({
        milestone: m.milestone,
        status: m.mstatus,
        description: m.miledes,
        target: 0,
        project_id,
        organization_id: organization.id,
    }));
    try {
        yield (0, config_1.default)("milestone").insert(milestoneData);
        res.status(201).json({ message: "Milestones added successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addMilestones = addMilestones;
const addSponsors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project_id } = req.params;
    const { sponsors } = req.body;
    const sponsorUploads = Array.isArray(req.files)
        ? req.files.filter((file) => file.fieldname.startsWith("sponsors["))
        : [];
    const sponsorData = sponsors.map((s, i) => {
        var _a;
        return ({
            name: s.sponsor,
            image: ((_a = sponsorUploads === null || sponsorUploads === void 0 ? void 0 : sponsorUploads[i]) === null || _a === void 0 ? void 0 : _a.location) || null,
            description: s.sdesc,
            project_id,
        });
    });
    try {
        yield (0, config_1.default)("project_sponsor").insert(sponsorData);
        res.status(201).json({ message: "Sponsors added successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addSponsors = addSponsors;
const addBeneficiaries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project_id } = req.params;
    const { beneficiaries } = req.body;
    const data = beneficiaries.map((b) => ({
        state: b.state || "",
        city: b.city || "",
        community: b.address,
        contact: b.contact,
        project_id,
    }));
    try {
        yield (0, config_1.default)("beneficiary").insert(data);
        res.status(201).json({ message: "Beneficiaries added successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addBeneficiaries = addBeneficiaries;
const addProjectImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project_id } = req.params;
    const imageUploads = Array.isArray(req.files)
        ? req.files.filter((file) => file.fieldname.startsWith("images["))
        : [];
    const imageData = imageUploads.map((img) => ({
        image: img.location,
        project_id,
    }));
    try {
        yield (0, config_1.default)("project_images").insert(imageData);
        res.status(201).json({ message: "Images uploaded successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addProjectImages = addProjectImages;
const deleteMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { milestone_id } = req.params;
    try {
        yield (0, config_1.default)("milestone").where({ id: milestone_id }).del();
        res.json({ message: "Milestone removed" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteMilestone = deleteMilestone;
const deleteSponsor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sponsor_id } = req.params;
    try {
        const deleted = yield (0, config_1.default)("project_sponsor").where({ id: sponsor_id }).del();
        if (!deleted) {
            return res
                .status(404)
                .json({ status: "fail", message: "Sponsor not found" });
        }
        res
            .status(200)
            .json({ status: "success", message: "Sponsor deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});
exports.deleteSponsor = deleteSponsor;
// Delete Beneficiary
const deleteBeneficiary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { beneficiary_id } = req.params;
    try {
        const deleted = yield (0, config_1.default)("beneficiary").where({ id: beneficiary_id }).del();
        if (!deleted) {
            return res
                .status(404)
                .json({ status: "fail", message: "Beneficiary not found" });
        }
        res
            .status(200)
            .json({ status: "success", message: "Beneficiary deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});
exports.deleteBeneficiary = deleteBeneficiary;
// Delete Project Image
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image_id } = req.params;
    try {
        const deleted = yield (0, config_1.default)("project_images").where({ id: image_id }).del();
        if (!deleted) {
            return res
                .status(404)
                .json({ status: "fail", message: "Image not found" });
        }
        res
            .status(200)
            .json({ status: "success", message: "Image deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});
exports.deleteImage = deleteImage;
// Similarly for sponsor, beneficiary, image...
