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
exports.checkApplicationStatus = exports.submitProposal = exports.updateMilestoneUpdateStatus = exports.deleteMilestoneUpdate = exports.payProjectOrganizationPayout = exports.getProjectOrganizationFundingDetail = exports.getProjectOrganizations = exports.createMilestone = exports.updateProjectApplicationStatus = exports.getProjectApplications = exports.editProject = exports.publishProjectBrief = exports.createProject = exports.getDonorProjects = exports.getDonorProjectMetrics = exports.downloadSampleNGOFile = exports.bulkUploadNGOsEndpoint = exports.addSingleNGO = exports.getAllOrganizations = exports.deleteBank = exports.getOrganizationCounts = exports.updateOne = exports.changePassword = exports.deactivate = exports.resetPassword = exports.forgotPassword = exports.getOne = exports.resend = exports.onboard = exports.logout = exports.login = exports.verify = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const xlsx_1 = __importDefault(require("xlsx"));
const config_1 = __importDefault(require("../../config"));
const general_1 = require("../../middleware/general");
const jwt_1 = require("../../utils/jwt");
const mail_1 = __importDefault(require("../../utils/mail"));
const otp_1 = require("../../utils/otp");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password, uuid } = req.body;
    const mail = email.trim();
    let newUser;
    try {
        if (uuid === "giveback") {
            newUser = {
                email: mail,
                password: uuid,
                status: 1,
                active: 1,
                token: 0,
            };
        }
        else if (uuid === "donor" || uuid === "google-donor") {
            newUser = {
                email: mail,
                password: (0, general_1.hash)(password.trim()),
                role: "donor",
                active: 1,
                token: (0, otp_1.generateOtp)(6),
            };
        }
        else if (uuid === "corporate") {
            if (!password) {
                res
                    .status(400)
                    .json({ error: "Password is required for corporate role" });
                return;
            }
            newUser = {
                email: mail,
                password: (0, general_1.hash)(password.trim()),
                role: "corporate",
                active: 1,
                token: (0, otp_1.generateOtp)(6),
            };
        }
        else {
            newUser = {
                email: mail,
                password: (0, general_1.hash)(password.trim()),
                active: 1,
                token: (0, otp_1.generateOtp)(6),
            };
        }
        const [id] = yield (0, config_1.default)("users").insert(newUser);
        const user = yield (0, config_1.default)("users").where({ id }).first();
        if (uuid !== "giveback" && uuid !== "google-donor") {
            const token = (_a = newUser.token) !== null && _a !== void 0 ? _a : 0;
            const url = "";
            const additionalData = { subject: "Welcome to the GivingBack Family!" };
            yield new mail_1.default({ email: mail, url, token, additionalData }).sendEmail("otp", "Welcome to the GivingBack Family!");
        }
        (0, jwt_1.createSendToken)(user, 200, req, res);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while signing up" });
    }
});
exports.signup = signup;
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = Number(req.body.otp);
        const user = yield (0, config_1.default)("users").where({ token: otp }).first();
        if (!user) {
            res.status(400).json({ error: "Invalid OTP" });
            return;
        }
        if (otp === user.token) {
            yield (0, config_1.default)("users").update({ status: 1, token: 0 }).where({ id: user.id });
            res.status(200).json({ message: "Email Verified" });
        }
        else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    }
    catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.verify = verify;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password: rawPassword, uuid } = req.body;
    const user = yield (0, config_1.default)("users").where({ email }).first();
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
        return (0, jwt_1.createSendToken)(user, 200, req, res);
    }
    const passwordIsValid = rawPassword && (yield bcryptjs_1.default.compare(rawPassword, user.password));
    if (!passwordIsValid) {
        res.status(400).json({ error: "Invalid Login Credentials" });
        return;
    }
    (0, jwt_1.createSendToken)(user, 200, req, res);
});
exports.login = login;
const logout = (req, res) => {
    res.cookie("giveback", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
exports.logout = logout;
const onboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { selectedOption, email, password, category, country, state, userType, cpassword, name, interest_area, orgemail, orgphone, phone, cac, } = req.body;
    const mail = email.trim();
    const token = (0, otp_1.generateOtp)(6);
    try {
        const filesToProcess = Array.isArray(req.files)
            ? req.files.filter((file) => file.fieldname === "userimg")
            : [];
        let newUser;
        if (selectedOption === "organization") {
            newUser = {
                email: mail,
                password: (0, general_1.hash)(password.trim()),
                role: "NGO",
                active: 1,
                token,
            };
        }
        else {
            newUser = {
                email: mail,
                password: (0, general_1.hash)(password.trim()),
                role: userType === "individual" ? "donor" : "corporate",
                active: 1,
                token,
            };
        }
        const [userRow] = yield (0, config_1.default)("users")
            .insert(newUser)
            .returning(["id", "email", "role", "active", "token"]);
        const userId = userRow;
        const user = yield (0, config_1.default)("users").where({ id: userId }).first();
        const additionalData = {
            subject: "Welcome to the GivingBack Family!",
            role: "User",
        };
        if (selectedOption === "organization") {
            const newOrg = {
                name: name === null || name === void 0 ? void 0 : name.trim(),
                phone: phone === null || phone === void 0 ? void 0 : phone.trim(),
                interest_area: interest_area === null || interest_area === void 0 ? void 0 : interest_area.trim(),
                cac: cac === null || cac === void 0 ? void 0 : cac.trim(),
                user_id: userId,
            };
            const [orgRow] = yield (0, config_1.default)("organizations").insert(newOrg).returning("id");
            const address = {
                state: state === null || state === void 0 ? void 0 : state.trim(),
                user_id: userId,
            };
            yield (0, config_1.default)("address").insert(address);
            yield new mail_1.default({
                email: mail,
                url: "",
                token,
                additionalData,
            }).sendEmail("otp", "Welcome to the GivingBack Family!");
        }
        else {
            const additionalFields = {
                orgemail: orgemail === null || orgemail === void 0 ? void 0 : orgemail.trim(),
                orgphone: orgphone === null || orgphone === void 0 ? void 0 : orgphone.trim(),
            };
            yield (0, config_1.default)("donors").insert({
                name: name === null || name === void 0 ? void 0 : name.trim(),
                phoneNumber: phone === null || phone === void 0 ? void 0 : phone.trim(),
                email: mail,
                interest_area: interest_area === null || interest_area === void 0 ? void 0 : interest_area.trim(),
                state: state === null || state === void 0 ? void 0 : state.trim(),
                user_id: userId,
                additional_information: JSON.stringify(additionalFields),
            });
        }
        if (filesToProcess.length > 0) {
            yield Promise.all(filesToProcess.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const doc = {
                    filename: file.location,
                    user_id: userId,
                };
                yield (0, config_1.default)("userimg").insert(doc);
            })));
        }
        yield new mail_1.default({
            email: mail,
            url: "",
            token,
            additionalData,
        }).sendEmail("otp", "Welcome to the GivingBack Family!");
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url: "",
            token,
            additionalData,
        }).sendEmail("adminonb", "New User");
        (0, jwt_1.createSendToken)(user, 200, req, res);
    }
    catch (error) {
        console.error("Onboard Error:", error);
    }
});
exports.onboard = onboard;
const resend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield (0, config_1.default)("users").where({ id: userId }).first();
    if (user) {
        const newToken = (0, otp_1.generateOtp)(6);
        yield (0, config_1.default)("users").where({ id: userId }).update({ token: newToken });
        const userEmail = user.email;
        const url = "";
        yield new mail_1.default({ email: userEmail, url, token: newToken }).sendEmail("welcome", "Welcome to the GivingBack Family!");
        res.status(200).json({ status: "success" });
    }
    else {
        res.status(404).json({ status: "error", error: "User not found" });
    }
});
exports.resend = resend;
const getBank = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, config_1.default)("banks")
        .where({ user_id: userId })
        .select("id", "bankName", "accountName", "accountNumber", "bvn");
});
const getAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, config_1.default)("address")
        .where({ user_id: userId })
        .select("state", "city_lga", "address");
});
const getOrCreateWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield (0, config_1.default)("wallet").where({ user_id: userId }).first();
    if (!wallet) {
        yield (0, config_1.default)("wallet").insert({
            user_id: userId,
            balance: 0.0,
            currency: "NGN",
        });
        wallet = yield (0, config_1.default)("wallet").where({ user_id: userId }).first();
    }
    // Ensure balance is a number
    if (wallet && typeof wallet.balance === "string") {
        wallet.balance = parseFloat(wallet.balance);
    }
    return wallet;
});
const getUserImage = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userImage = yield (0, config_1.default)("userimg").where({ user_id: userId }).first();
    return userImage || null;
});
function getTotalProjectsCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalProjectsCount = yield (0, config_1.default)("project")
            .where({ organization_id: userId })
            .count("id as totalCount")
            .first();
        return totalProjectsCount.totalCount || 0;
    });
}
function getActiveProjectsCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const activeProjectsCount = yield (0, config_1.default)("project")
            .where({ organization_id: userId, status: "active" })
            .count("id as activeCount")
            .first();
        return activeProjectsCount.activeCount || 0;
    });
}
function getDonationsCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const donationsCount = yield (0, config_1.default)("donations")
            .where({ ngo_id: userId })
            .count("donations.id as donationCount")
            .first();
        return donationsCount.donationCount || 0;
    });
}
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    let user = yield (0, config_1.default)("organizations")
        .where({ user_id: id })
        .select("id", "name", "phone", "website", "interest_area", "cac", "active")
        .first();
    if (!user) {
        user = yield (0, config_1.default)("donors")
            .where({ user_id: id })
            .select("id", "name", "phoneNumber", "industry", "email", "interest_area", "state", "city_lga", "address", "about", "image", "additional_information")
            .first();
        const userImage = yield getUserImage(id);
        const bank = yield getBank(id);
        const wallet = yield getOrCreateWallet(id);
        if (!user) {
            res.status(404).json({ error: "User not associated with any account" });
            return;
        }
        res.status(200).json({ user, userImage, wallet, bank });
        return;
    }
    const bank = yield getBank(id);
    const address = yield getAddress(id);
    const userImage = yield getUserImage(id);
    const allProjectsCount = yield getTotalProjectsCount(user.id);
    const activeProjectsCount = yield getActiveProjectsCount(user.id);
    const donationsCount = yield getDonationsCount(user.id);
    const wallet = yield getOrCreateWallet(id);
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
});
exports.getOne = getOne;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const token = (0, otp_1.generateOtp)(9);
    const encodedToken = Buffer.from(token.toString()).toString("base64");
    const user = yield (0, config_1.default)("users").update({ token }).where({ email });
    if (!user) {
        res
            .status(404)
            .json({ error: "There is no user associated with this email address" });
        return;
    }
    res.status(200).json({ status: "success", message: "Token sent to email!" });
    const url = `https://givebackng.org/auth/resetPassword/${encodedToken}`;
    yield new mail_1.default({ email, url, token }).sendEmail("passwordReset", "Your password reset token");
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    const password = (0, general_1.hash)(newPassword.trim());
    const numericToken = Number(token);
    const user = yield (0, config_1.default)("users")
        .update({ password, token: 0 })
        .where({ token: numericToken });
    if (!user) {
        res.status(400).json({ error: "Token is invalid" });
        return;
    }
    res.status(200).json({ message: "Password successfully changed" });
});
exports.resetPassword = resetPassword;
const deactivate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, config_1.default)("users")
        .update({ active: 0 })
        .where({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    res.status(200).json({ status: "success" });
});
exports.deactivate = deactivate;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { oldPassword, newPassword } = req.body;
    const user = yield (0, config_1.default)("users")
        .where({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
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
    const passwordIsValid = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!passwordIsValid) {
        res.status(400).json({ error: "Old password is incorrect" });
        return;
    }
    user.password = (0, general_1.hash)(newPassword.trim());
    yield (0, config_1.default)("users").where({ id: user.id }).update({ password: user.password });
    res.status(200).json({
        status: "success",
        message: "Password has been changed successfully!",
    });
    return;
});
exports.changePassword = changePassword;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { name, phone, phoneNumber, email, website, interest_area, cac, industry, state, city_lga, address, about, orgemail, orgphone, additional_information, bankName, accountName, accountNumber, bvn, } = req.body;
    try {
        const filesToProcess = Array.isArray(req.files)
            ? req.files.filter((file) => file.fieldname === "userimg")
            : [];
        if (filesToProcess.length > 0) {
            yield (0, config_1.default)("userimg").where({ user_id: id }).del();
            yield Promise.all(filesToProcess.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const doc = {
                    filename: file.location,
                    user_id: id,
                };
                yield (0, config_1.default)("userimg").insert(doc);
            })));
        }
        let orgUser = yield (0, config_1.default)("organizations").where({ user_id: id }).first();
        if (orgUser) {
            const updateData = {};
            if (name !== undefined)
                updateData.name = name === null || name === void 0 ? void 0 : name.trim();
            if (phone !== undefined)
                updateData.phone = phone === null || phone === void 0 ? void 0 : phone.trim();
            if (website !== undefined)
                updateData.website = website === null || website === void 0 ? void 0 : website.trim();
            if (interest_area !== undefined)
                updateData.interest_area = interest_area === null || interest_area === void 0 ? void 0 : interest_area.trim();
            if (cac !== undefined)
                updateData.cac = cac === null || cac === void 0 ? void 0 : cac.trim();
            if (Object.keys(updateData).length > 0) {
                yield (0, config_1.default)("organizations").where({ user_id: id }).update(updateData);
            }
            const addressData = {};
            if (state !== undefined)
                addressData.state = state === null || state === void 0 ? void 0 : state.trim();
            if (city_lga !== undefined)
                addressData.city_lga = city_lga === null || city_lga === void 0 ? void 0 : city_lga.trim();
            if (address !== undefined)
                addressData.address = address === null || address === void 0 ? void 0 : address.trim();
            if (Object.keys(addressData).length > 0) {
                const existingAddress = yield (0, config_1.default)("address")
                    .where({ user_id: id })
                    .first();
                if (existingAddress) {
                    yield (0, config_1.default)("address").where({ user_id: id }).update(addressData);
                }
                else {
                    addressData.user_id = id;
                    yield (0, config_1.default)("address").insert(addressData);
                }
            }
            const bankData = {};
            if (bankName !== undefined)
                bankData.bankName = bankName === null || bankName === void 0 ? void 0 : bankName.trim();
            if (accountName !== undefined)
                bankData.accountName = accountName === null || accountName === void 0 ? void 0 : accountName.trim();
            if (accountNumber !== undefined)
                bankData.accountNumber = accountNumber === null || accountNumber === void 0 ? void 0 : accountNumber.trim();
            if (bvn !== undefined)
                bankData.bvn = bvn === null || bvn === void 0 ? void 0 : bvn.trim();
            if (Object.keys(bankData).length > 0) {
                bankData.user_id = id;
                yield (0, config_1.default)("banks").insert(bankData);
            }
            const updatedOrg = yield (0, config_1.default)("organizations")
                .where({ user_id: id })
                .select("id", "name", "phone", "website", "interest_area", "cac", "active")
                .first();
            const bank = yield getBank(id);
            const address_data = yield getAddress(id);
            const userImage = yield getUserImage(id);
            const allProjectsCount = yield getTotalProjectsCount(updatedOrg.id);
            const activeProjectsCount = yield getActiveProjectsCount(updatedOrg.id);
            const donationsCount = yield getDonationsCount(updatedOrg.id);
            const wallet = yield getOrCreateWallet(id);
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
        let donorUser = yield (0, config_1.default)("donors").where({ user_id: id }).first();
        if (donorUser) {
            const updateData = {};
            if (name !== undefined)
                updateData.name = name === null || name === void 0 ? void 0 : name.trim();
            if (phoneNumber !== undefined)
                updateData.phoneNumber = phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.trim();
            if (email !== undefined)
                updateData.email = email === null || email === void 0 ? void 0 : email.trim();
            if (industry !== undefined)
                updateData.industry = industry === null || industry === void 0 ? void 0 : industry.trim();
            if (interest_area !== undefined)
                updateData.interest_area = interest_area === null || interest_area === void 0 ? void 0 : interest_area.trim();
            if (state !== undefined)
                updateData.state = state === null || state === void 0 ? void 0 : state.trim();
            if (city_lga !== undefined)
                updateData.city_lga = city_lga === null || city_lga === void 0 ? void 0 : city_lga.trim();
            if (address !== undefined)
                updateData.address = address === null || address === void 0 ? void 0 : address.trim();
            if (about !== undefined)
                updateData.about = about === null || about === void 0 ? void 0 : about.trim();
            if (additional_information !== undefined) {
                updateData.additional_information = JSON.stringify({
                    orgemail: orgemail === null || orgemail === void 0 ? void 0 : orgemail.trim(),
                    orgphone: orgphone === null || orgphone === void 0 ? void 0 : orgphone.trim(),
                });
            }
            if (Object.keys(updateData).length > 0) {
                yield (0, config_1.default)("donors").where({ user_id: id }).update(updateData);
            }
            const addressData = {};
            if (state !== undefined)
                addressData.state = state === null || state === void 0 ? void 0 : state.trim();
            if (city_lga !== undefined)
                addressData.city_lga = city_lga === null || city_lga === void 0 ? void 0 : city_lga.trim();
            if (address !== undefined)
                addressData.address = address === null || address === void 0 ? void 0 : address.trim();
            if (Object.keys(addressData).length > 0) {
                const existingAddress = yield (0, config_1.default)("address")
                    .where({ user_id: id })
                    .first();
                if (existingAddress) {
                    yield (0, config_1.default)("address").where({ user_id: id }).update(addressData);
                }
                else {
                    addressData.user_id = id;
                    yield (0, config_1.default)("address").insert(addressData);
                }
            }
            const bankData = {};
            if (bankName !== undefined)
                bankData.bankName = bankName === null || bankName === void 0 ? void 0 : bankName.trim();
            if (accountName !== undefined)
                bankData.accountName = accountName === null || accountName === void 0 ? void 0 : accountName.trim();
            if (accountNumber !== undefined)
                bankData.accountNumber = accountNumber === null || accountNumber === void 0 ? void 0 : accountNumber.trim();
            if (bvn !== undefined)
                bankData.bvn = bvn === null || bvn === void 0 ? void 0 : bvn.trim();
            if (Object.keys(bankData).length > 0) {
                bankData.user_id = id;
                yield (0, config_1.default)("banks").insert(bankData);
            }
            const updatedDonor = yield (0, config_1.default)("donors")
                .where({ user_id: id })
                .select("id", "name", "phoneNumber", "industry", "email", "interest_area", "state", "city_lga", "address", "about", "image", "additional_information")
                .first();
            const bank = yield getBank(id);
            const address_data = yield getAddress(id);
            const userImage = yield getUserImage(id);
            const wallet = yield getOrCreateWallet(id);
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
    }
    catch (error) {
        console.error("Update Error:", error);
        res
            .status(500)
            .json({ error: "An error occurred while updating user details" });
    }
});
exports.updateOne = updateOne;
const getOrganizationCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(400).json({ error: "User ID not found" });
            return;
        }
        const donor = yield (0, config_1.default)("donors").where({ user_id: userId }).first();
        if (!donor) {
            res.status(404).json({ error: "Donor not found" });
            return;
        }
        const donorId = donor.id;
        const totalOrganizationsResult = yield (0, config_1.default)("organizations")
            .count("id as totalCount")
            .first();
        const totalOrganizations = (totalOrganizationsResult === null || totalOrganizationsResult === void 0 ? void 0 : totalOrganizationsResult.totalCount) || 0;
        const donorOrganizationsResult = yield (0, config_1.default)("organizations")
            .where({
            donor_id: donorId,
        })
            .count("id as donorOrgCount")
            .first();
        const donorOrganizationCount = (donorOrganizationsResult === null || donorOrganizationsResult === void 0 ? void 0 : donorOrganizationsResult.donorOrgCount) || 0;
        const verifiedOrganizationsResult = yield (0, config_1.default)("organizations")
            .where({ is_verified: 1 })
            .count("id as verifiedCount")
            .first();
        const verifiedOrganizationsCount = (verifiedOrganizationsResult === null || verifiedOrganizationsResult === void 0 ? void 0 : verifiedOrganizationsResult.verifiedCount) || 0;
        res.status(200).json({
            totalOrganizations,
            donorOrganizationCount,
            verifiedOrganizationsCount,
        });
    }
    catch (error) {
        console.error("Get Organization Counts Error:", error);
        res
            .status(500)
            .json({ error: "An error occurred while fetching organization counts" });
    }
});
exports.getOrganizationCounts = getOrganizationCounts;
const deleteBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    try {
        const bank = yield (0, config_1.default)("banks").where({ id, user_id: userId }).first();
        if (!bank) {
            res.status(404).json({ error: "Bank account not found" });
            return;
        }
        yield (0, config_1.default)("banks").where({ id, user_id: userId }).del();
        res.status(200).json({
            status: "success",
            message: "Bank account deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Bank Error:", error);
        res
            .status(500)
            .json({ error: "An error occurred while deleting bank account" });
    }
});
exports.deleteBank = deleteBank;
const getAllOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { is_verified, donor_id } = req.query;
        let query = (0, config_1.default)("organizations")
            .leftJoin("users", "organizations.user_id", "users.id")
            .select("organizations.*", "users.email");
        if (is_verified !== undefined) {
            query = query.where({ "organizations.is_verified": Number(is_verified) });
        }
        if (donor_id !== undefined) {
            query = query.where({ "organizations.donor_id": Number(donor_id) });
        }
        const organizations = yield query.orderBy("organizations.created_at", "asc");
        res.status(200).json({
            status: "success",
            count: organizations.length,
            data: organizations,
        });
    }
    catch (error) {
        console.error("Get All Organizations Error:", error);
        res.status(500).json({
            error: "An error occurred while fetching organizations",
        });
    }
});
exports.getAllOrganizations = getAllOrganizations;
function generateRandomPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
const addSingleNGO = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield config_1.default.transaction();
    try {
        const { name, email, phone, address, state, city_lga, interest_area, cac, website, accountName, accountNumber, bankName, bvn, } = req.body;
        const donorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!donorId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const donor = yield (0, config_1.default)("donors").where({ user_id: donorId }).first();
        if (!name || !email || !phone) {
            res.status(400).json({
                error: "Name, email, and phone are required fields",
            });
            return;
        }
        const mail = email.trim();
        const existingUser = yield (0, config_1.default)("users").where({ email: mail }).first();
        if (existingUser) {
            res.status(409).json({ error: "User with this email already exists" });
            return;
        }
        const generatedPassword = generateRandomPassword(12);
        const hashedPassword = (0, general_1.hash)(generatedPassword.trim());
        const [userId] = yield transaction("users").insert({
            email: mail,
            password: hashedPassword,
            active: 1,
            role: "NGO",
            status: 1,
            token: 0,
        });
        yield transaction("organizations").insert({
            name,
            phone,
            website: website || null,
            interest_area: interest_area || null,
            cac: cac || null,
            user_id: userId,
            active: 1,
            is_verified: 0,
            donor_id: donor.id,
        });
        if (address || state || city_lga) {
            yield transaction("address").insert({
                address: address || null,
                state: state || null,
                city_lga: city_lga || null,
                user_id: userId,
            });
        }
        if (bankName || accountNumber || accountName) {
            yield transaction("banks").insert({
                bankName: bankName || null,
                accountName: accountName || null,
                accountNumber: accountNumber || null,
                bvn: bvn || null,
                user_id: userId,
            });
        }
        yield transaction.commit();
        try {
            yield new mail_1.default({
                email: mail,
                url: "",
                token: 0,
                additionalData: {
                    subject: "Welcome to GivingBack - Your NGO Account",
                    password: generatedPassword,
                    name,
                },
            }).sendEmail("ngowelcome", "Your NGO Account Has Been Created");
        }
        catch (emailError) {
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
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Add Single NGO Error:", error);
        res.status(500).json({
            error: "An error occurred while adding the NGO",
        });
    }
});
exports.addSingleNGO = addSingleNGO;
const bulkUploadNGOs = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workbook = xlsx_1.default.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx_1.default.utils.sheet_to_json(sheet);
        const ngos = rows.filter((row) => row.Name && row.Email && row.Phone);
        if (ngos.length === 0) {
            return {
                success: false,
                error: "No valid rows found in the file",
            };
        }
        const successCount = [];
        const errorCount = [];
        yield config_1.default.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            for (const ngo of ngos) {
                try {
                    const mail = ngo.Email.trim();
                    const existingUser = yield trx("users")
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
                    const hashedPassword = (0, general_1.hash)(generatedPassword.trim());
                    const [userId] = yield trx("users").insert({
                        email: mail,
                        password: hashedPassword,
                        active: 1,
                        role: "NGO",
                        status: 1,
                        token: 0,
                    });
                    yield trx("organizations").insert({
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
                        yield trx("address").insert({
                            address: ngo.Address || null,
                            state: ngo.State || null,
                            city_lga: ngo.City_LGA || null,
                            user_id: userId,
                        });
                    }
                    if (ngo.BankName || ngo.AccountNumber || ngo.AccountName) {
                        yield trx("banks").insert({
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
                        yield new mail_1.default({
                            email: mail,
                            url: "",
                            token: 0,
                            additionalData: {
                                subject: "Welcome to GivingBack - Your NGO Account",
                                password: generatedPassword,
                                name: ngo.Name,
                            },
                        }).sendEmail("ngowelcome", "Your NGO Account Has Been Created");
                    }
                    catch (emailError) {
                        console.error("Error sending email to " + mail + ":", emailError);
                    }
                }
                catch (error) {
                    errorCount.push({
                        name: ngo.Name,
                        email: ngo.Email,
                        error: error instanceof Error ? error.message : "Unknown error occurred",
                    });
                }
            }
        }));
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
    }
    catch (error) {
        console.error("Error occurred during bulk upload:", error);
        return {
            success: false,
            error: `Unable to perform bulk upload: ${error}`,
        };
    }
});
const bulkUploadNGOsEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file || !req.file.buffer) {
            res.status(400).json({ error: "File is required" });
            return;
        }
        const fileBuffer = req.file.buffer;
        const result = yield bulkUploadNGOs(fileBuffer);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        console.error("Error in bulk upload route:", error);
        res.status(500).json({ error: "Unable to upload data" });
    }
});
exports.bulkUploadNGOsEndpoint = bulkUploadNGOsEndpoint;
const downloadSampleNGOFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workbook = xlsx_1.default.utils.book_new();
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
        const sheet = xlsx_1.default.utils.aoa_to_sheet(sampleData);
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
        xlsx_1.default.utils.book_append_sheet(workbook, sheet, "Sample NGOs");
        const buffer = xlsx_1.default.write(workbook, { type: "buffer" });
        res.setHeader("Content-Disposition", "attachment; filename=sample_ngos_bulk.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(Buffer.from(buffer));
    }
    catch (error) {
        console.error("Error generating sample file:", error);
        res.status(500).json({ error: "Unable to generate sample file" });
    }
});
exports.downloadSampleNGOFile = downloadSampleNGOFile;
const getDonorProjectMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(400).json({ error: "User not found" });
            return;
        }
        const donor = yield (0, config_1.default)("donors").where({ user_id: userId }).first();
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
        const completedResult = yield (0, config_1.default)("project")
            .where({
            donor_id: donorId,
            status: "completed",
        })
            .count("id as count")
            .first();
        const completedProjects = (completedResult === null || completedResult === void 0 ? void 0 : completedResult.count) || 0;
        const briefResult = yield (0, config_1.default)("project")
            .where({ donor_id: donorId, status: "brief" })
            .count("id as count")
            .first();
        const activeBriefs = (briefResult === null || briefResult === void 0 ? void 0 : briefResult.count) || 0;
        const activeResult = yield (0, config_1.default)("project")
            .where({ donor_id: donorId, status: "active" })
            .count("id as count")
            .first();
        const ongoingProjects = (activeResult === null || activeResult === void 0 ? void 0 : activeResult.count) || 0;
        const applicationsResult = yield (0, config_1.default)("project")
            .where({ donor_id: donorId })
            .sum("applications as totalApplications")
            .first();
        const totalApplications = (applicationsResult === null || applicationsResult === void 0 ? void 0 : applicationsResult.totalApplications) || 0;
        res.status(200).json({
            completedProjects,
            activeBriefs,
            ongoingProjects,
            totalApplications,
        });
    }
    catch (error) {
        console.error("Get Donor Project Metrics Error:", error);
        res.status(500).json({
            error: "An error occurred while fetching project metrics",
        });
    }
});
exports.getDonorProjectMetrics = getDonorProjectMetrics;
const getDonorProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const donor = yield (0, config_1.default)("donors").where({ user_id: userId }).first();
        if (!donor) {
            res.status(404).json({ error: "Donor not found" });
            return;
        }
        const donorId = donor.id;
        const { status } = req.query;
        let query = (0, config_1.default)("project").where({ donor_id: donorId });
        if (status && typeof status === "string") {
            query = query.andWhere("status", status);
        }
        const projects = yield query
            .select("id", "title", config_1.default.raw('DATE_FORMAT(startDate, "%Y-%m-%d") AS startDate'), config_1.default.raw('DATE_FORMAT(endDate, "%Y-%m-%d") AS endDate'), "description", "objectives", "category", "organization_id", "multi_ngo", "cost", "ispublic", "scope", "allocated", "beneficiary_overview", "status", "applications", "createdAt", "updatedAt")
            .orderBy("createdAt", "desc");
        // Enrich each project with organization details
        const enrichedProjects = yield Promise.all(projects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
            let organizationIds = [];
            if (project.multi_ngo) {
                const projectOrganizations = yield (0, config_1.default)("project_organization")
                    .where({ project_id: project.id })
                    .select("organization_id");
                organizationIds = projectOrganizations.map((po) => po.organization_id);
            }
            else if (project.organization_id) {
                organizationIds = [project.organization_id];
            }
            let organizations = [];
            if (organizationIds.length > 0) {
                organizations = yield (0, config_1.default)("organizations")
                    .whereIn("id", organizationIds)
                    .select("id", "name", "phone", "website", "interest_area", "cac", "active", "is_verified", "user_id");
                organizations = yield Promise.all(organizations.map((org) => __awaiter(void 0, void 0, void 0, function* () {
                    const image = yield getUserImage(org.user_id);
                    return Object.assign(Object.assign({}, org), { image: (image === null || image === void 0 ? void 0 : image.filename) || null });
                })));
            }
            // Check if milestones are added for this project
            const milestonesResult = yield (0, config_1.default)("milestone")
                .where({ project_id: project.id })
                .count("id as count")
                .first();
            const hasMilestones = ((milestonesResult === null || milestonesResult === void 0 ? void 0 : milestonesResult.count) || 0) > 0;
            return Object.assign(Object.assign({}, project), { organization: project.multi_ngo
                    ? organizations
                    : organizations[0] || null, hasMilestones: hasMilestones, milestonesCount: (milestonesResult === null || milestonesResult === void 0 ? void 0 : milestonesResult.count) || 0 });
        })));
        res.status(200).json({
            status: "success",
            count: enrichedProjects.length,
            data: enrichedProjects,
        });
    }
    catch (error) {
        console.error("Get Donor Projects Error:", error);
        res.status(500).json({
            error: "An error occurred while fetching donor projects",
        });
    }
});
exports.getDonorProjects = getDonorProjects;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield config_1.default.transaction();
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                status: "fail",
                message: "Unauthorized: User not found",
            });
            return;
        }
        const donor = yield (0, config_1.default)("donors").where({ user_id: userId }).first();
        if (!donor) {
            res.status(400).json({
                status: "fail",
                message: "User is not registered as a donor",
            });
            return;
        }
        const donorId = donor.id;
        const { title, category, description, budget, deadline, state, lga, status, ispublic, visibilityType, organization_ids = [], selectedAreas = [], } = req.body;
        const missingFields = [];
        if (!title)
            missingFields.push("title");
        if (!category)
            missingFields.push("category");
        if (!description)
            missingFields.push("description");
        if (!budget)
            missingFields.push("budget");
        if (!deadline)
            missingFields.push("deadline");
        if (!state)
            missingFields.push("state");
        if (!lga)
            missingFields.push("lga");
        if (!status)
            missingFields.push("status");
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
        // Ensure deadline is at least one month ahead
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(now.getMonth() + 1);
        if (isNaN(deadlineDate.getTime())) {
            res.status(400).json({
                status: "fail",
                error: "Deadline must be a valid date (YYYY-MM-DD)",
            });
            return;
        }
        if (deadlineDate < oneMonthLater) {
            res.status(400).json({
                status: "fail",
                error: "Deadline must be at least one month from today.",
            });
            return;
        }
        // Only check wallet balance if status is NOT "draft"
        if (status !== "draft") {
            const wallet = yield getOrCreateWallet(userId);
            console.log(wallet);
            if (!wallet ||
                typeof wallet.balance !== "number" ||
                wallet.balance < cost) {
                res.status(400).json({
                    status: "fail",
                    error: "Insufficient wallet balance to create this project.",
                });
                return;
            }
        }
        const validStatuses = ["draft", "brief", "active", "completed"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({
                status: "fail",
                error: `Status must be one of: ${validStatuses.join(", ")}`,
            });
            return;
        }
        let organization_id = null;
        let multiNgo = false;
        // Handle organization_ids based on visibilityType
        let orgIds = [];
        if (visibilityType === "private") {
            // Private: use provided organization_ids (array of numbers)
            orgIds = Array.isArray(organization_ids)
                ? organization_ids.map((id) => Number(id)).filter((id) => !isNaN(id))
                : [];
            // For private visibility, add organizations to project profile
            if (orgIds.length === 1) {
                organization_id = orgIds[0];
                multiNgo = false;
            }
            else if (orgIds.length > 1) {
                organization_id = null;
                multiNgo = true;
            }
        }
        else if (visibilityType === "select-area") {
            // Select Area: fetch organizations matching the selected areas
            // selectedAreas is an array of area names like ["Education", "Healthcare"]
            const areas = Array.isArray(selectedAreas)
                ? selectedAreas.map((area) => typeof area === "string" ? area : area.value || area.label)
                : [];
            if (areas.length > 0) {
                // Query organizations where interest_area contains any of the selected areas
                // interest_area can be "area1,area2,area3" (comma-separated)
                const organizations = yield (0, config_1.default)("organizations")
                    .select("id")
                    .where(function (builder) {
                    areas.forEach((area, index) => {
                        if (index === 0) {
                            builder.whereRaw("FIND_IN_SET(?, interest_area)", [area]);
                        }
                        else {
                            builder.orWhereRaw("FIND_IN_SET(?, interest_area)", [area]);
                        }
                    });
                });
                orgIds = organizations.map((org) => org.id);
                console.log(`Selected areas: ${areas.join(", ")} => Found organizations: ${orgIds.join(", ")}`);
            }
            // For select-area, do NOT add to organization profile
        }
        else if (visibilityType === "public") {
            // Public: find organizations where category matches interest_area
            const organizations = yield (0, config_1.default)("organizations")
                .select("id")
                .where(function (builder) {
                builder.whereRaw("FIND_IN_SET(?, interest_area)", [category]);
            });
            orgIds = organizations.map((org) => org.id);
            console.log(`Public visibility with category: ${category} => Found organizations: ${orgIds.join(", ")}`);
            // For public, do NOT add to organization profile
        }
        const [projectId] = yield transaction("project").insert({
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
            organization_id: organization_id || null,
            multi_ngo: multiNgo,
            ispublic: ispublic !== null && ispublic !== void 0 ? ispublic : false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Only create project_organization records for private visibility
        if (visibilityType === "private" && multiNgo && orgIds.length > 0) {
            const projectOrgRecords = orgIds.map((orgId) => ({
                project_id: projectId,
                organization_id: orgId,
                created_at: new Date(),
                updated_at: new Date(),
            }));
            yield transaction("project_organization").insert(projectOrgRecords);
        }
        yield transaction.commit();
        const createdProject = yield (0, config_1.default)("project").where({ id: projectId }).first();
        const donorUser = yield (0, config_1.default)("users").where({ id: userId }).first();
        const donorInfo = yield (0, config_1.default)("donors").where({ id: donorId }).first();
        try {
            if (status === "draft") {
                yield new mail_1.default({
                    email: donorUser.email,
                    url: "",
                    token: 0,
                    additionalData: {
                        subject: "Project Brief Saved as Draft",
                        projectTitle: createdProject.title,
                        projectDescription: createdProject.description,
                        budget: createdProject.cost,
                        donorName: (donorInfo === null || donorInfo === void 0 ? void 0 : donorInfo.name) || "Donor",
                    },
                }).sendEmail("donorbriefdraft", "Project Brief Saved as Draft");
            }
            else if (status === "brief") {
                yield new mail_1.default({
                    email: donorUser.email,
                    url: "",
                    token: 0,
                    additionalData: {
                        subject: "Your Project Brief is Ready for Review",
                        projectTitle: createdProject.title,
                        projectDescription: createdProject.description,
                        budget: createdProject.cost,
                        donorName: (donorInfo === null || donorInfo === void 0 ? void 0 : donorInfo.name) || "Donor",
                        state: createdProject.state,
                        city: createdProject.city,
                    },
                }).sendEmail("donorbriefready", "Your Project Brief is Ready for Review");
            }
            else if (status === "active") {
                yield new mail_1.default({
                    email: donorUser.email,
                    url: "",
                    token: 0,
                    additionalData: {
                        subject: "Your Project is Now Active",
                        projectTitle: createdProject.title,
                        projectDescription: createdProject.description,
                        budget: createdProject.cost,
                        donorName: (donorInfo === null || donorInfo === void 0 ? void 0 : donorInfo.name) || "Donor",
                        state: createdProject.state,
                        city: createdProject.city,
                    },
                }).sendEmail("donorbriefactive", "Your Project is Now Active");
                // Send notification emails for private visibility
                if (visibilityType === "private" && orgIds.length > 0) {
                    try {
                        for (const orgId of orgIds) {
                            const organization = yield (0, config_1.default)("organizations")
                                .where({ id: orgId })
                                .first();
                            if (organization && organization.user_id) {
                                const ngoUser = yield (0, config_1.default)("users")
                                    .where({ id: organization.user_id })
                                    .first();
                                if (ngoUser && ngoUser.email) {
                                    yield new mail_1.default({
                                        email: ngoUser.email,
                                        url: "",
                                        token: 0,
                                        additionalData: {
                                            subject: "New Project Assignment",
                                            projectTitle: createdProject.title,
                                            projectDescription: createdProject.description,
                                            budget: createdProject.cost,
                                            ngoName: organization.name || "NGO",
                                            state: createdProject.state,
                                            city: createdProject.city,
                                            donorName: (donorInfo === null || donorInfo === void 0 ? void 0 : donorInfo.name) || "Donor",
                                        },
                                    }).sendEmail("ngoprojectassignment", "New Project Assignment");
                                    console.log(`Email sent to NGO: ${organization.name} (${ngoUser.email})`);
                                }
                            }
                        }
                    }
                    catch (ngoEmailError) {
                        console.error("Error sending project assignment emails to NGOs:", ngoEmailError);
                    }
                }
                // Send notification emails for select-area and public visibility
                else if ((visibilityType === "select-area" || visibilityType === "public") &&
                    orgIds.length > 0) {
                    try {
                        for (const orgId of orgIds) {
                            const organization = yield (0, config_1.default)("organizations")
                                .where({ id: orgId })
                                .first();
                            if (organization && organization.user_id) {
                                const ngoUser = yield (0, config_1.default)("users")
                                    .where({ id: organization.user_id })
                                    .first();
                                if (ngoUser && ngoUser.email) {
                                    yield new mail_1.default({
                                        email: ngoUser.email,
                                        url: "",
                                        token: 0,
                                        additionalData: {
                                            subject: "New Project Brief Available",
                                            projectTitle: createdProject.title,
                                            projectDescription: createdProject.description,
                                            budget: createdProject.cost,
                                            ngoName: organization.name || "NGO",
                                            state: createdProject.state,
                                            city: createdProject.city,
                                            donorName: (donorInfo === null || donorInfo === void 0 ? void 0 : donorInfo.name) || "Donor",
                                            projectCategory: createdProject.category,
                                        },
                                    }).sendEmail("ngoprojectnotification", "New Project Brief Available");
                                    console.log(`Notification email sent to NGO: ${organization.name} (${ngoUser.email})`);
                                }
                            }
                        }
                    }
                    catch (ngoEmailError) {
                        console.error("Error sending project notification emails to NGOs:", ngoEmailError);
                    }
                }
            }
        }
        catch (emailError) {
            console.error("Error sending project notification email:", emailError);
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
                deadline: createdProject.endDate,
                state: createdProject.state,
                city: createdProject.city,
                status: createdProject.status,
                donor_id: createdProject.donor_id,
                organization_id: createdProject.organization_id,
                multi_ngo: createdProject.multi_ngo,
                organization_ids: visibilityType === "private" && multiNgo ? orgIds : [],
                ispublic: createdProject.ispublic,
                createdAt: createdProject.createdAt,
            },
        });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Create Project Error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while creating the project brief",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createProject = createProject;
const publishProjectBrief = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const donor = yield (0, config_1.default)("donors").where({ user_id: userId }).first();
        if (!donor) {
            res.status(400).json({
                status: "fail",
                message: "User is not registered as a donor",
            });
            return;
        }
        const project = yield (0, config_1.default)("project").where({ id }).first();
        if (!project) {
            res.status(404).json({
                status: "fail",
                error: "Project not found",
            });
            return;
        }
        if (project.donor_id !== donor.id) {
            res.status(403).json({
                status: "fail",
                error: "You do not have permission to update this project",
            });
            return;
        }
        if (project.status !== "draft") {
            res.status(400).json({
                status: "fail",
                error: `Project is in ${project.status} status. Only draft projects can be published to brief status`,
            });
            return;
        }
        // Check wallet balance before publishing
        const wallet = yield getOrCreateWallet(userId);
        if (!wallet ||
            typeof wallet.balance !== "number" ||
            wallet.balance < project.cost) {
            res.status(400).json({
                status: "fail",
                error: "Insufficient wallet balance to publish this project. Please fund your wallet.",
            });
            return;
        }
        yield (0, config_1.default)("project").where({ id }).update({
            status: "brief",
            updatedAt: new Date(),
        });
        const updatedProject = yield (0, config_1.default)("project").where({ id }).first();
        const donorUser = yield (0, config_1.default)("users").where({ id: userId }).first();
        const donorInfo = yield (0, config_1.default)("donors").where({ id: donor.id }).first();
        try {
            yield new mail_1.default({
                email: donorUser.email,
                url: "",
                token: 0,
                additionalData: {
                    subject: "Your Project Brief is Ready for Review",
                    projectTitle: updatedProject.title,
                    projectDescription: updatedProject.description,
                    budget: updatedProject.cost,
                    donorName: (donorInfo === null || donorInfo === void 0 ? void 0 : donorInfo.name) || "Donor",
                    state: updatedProject.state,
                    city: updatedProject.city,
                },
            }).sendEmail("donorbriefready", "Your Project Brief is Ready for Review");
        }
        catch (emailError) {
            console.error("Error sending project publish notification email:", emailError);
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
    }
    catch (error) {
        console.error("Publish Project Brief Error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while updating the project status",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.publishProjectBrief = publishProjectBrief;
const editProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const donor = yield (0, config_1.default)("donors").where({ user_id: userId }).first();
        if (!donor) {
            res.status(400).json({
                status: "fail",
                message: "User is not registered as a donor",
            });
            return;
        }
        const project = yield (0, config_1.default)("project").where({ id }).first();
        if (!project) {
            res.status(404).json({
                status: "fail",
                error: "Project not found",
            });
            return;
        }
        if (project.donor_id !== donor.id) {
            res.status(403).json({
                status: "fail",
                error: "You do not have permission to edit this project",
            });
            return;
        }
        if (project.status === "active") {
            res.status(400).json({
                status: "fail",
                error: `Project is in ${project.status} status. Active projects cannot be edited`,
            });
            return;
        }
        const { title, category, description, budget, deadline, state, lga, ispublic, organization_ids, } = req.body;
        // Prepare update object with only provided fields
        const updateData = {};
        if (title !== undefined)
            updateData.title = title.trim();
        if (category !== undefined)
            updateData.category = category;
        if (description !== undefined)
            updateData.description = description;
        if (budget !== undefined) {
            const cost = parseFloat(String(budget));
            if (isNaN(cost) || cost <= 0) {
                res.status(400).json({
                    status: "fail",
                    error: "Budget must be a valid positive number",
                });
                return;
            }
            updateData.cost = cost;
        }
        if (deadline !== undefined) {
            const deadlineDate = new Date(deadline);
            if (isNaN(deadlineDate.getTime())) {
                res.status(400).json({
                    status: "fail",
                    error: "Deadline must be a valid date (YYYY-MM-DD)",
                });
                return;
            }
            updateData.endDate = deadline;
        }
        if (state !== undefined)
            updateData.state = state;
        if (lga !== undefined)
            updateData.city = lga;
        if (ispublic !== undefined)
            updateData.ispublic = ispublic;
        updateData.updatedAt = new Date();
        // Handle organization_ids update if provided
        let organization_id = project.organization_id;
        let multiNgo = project.multi_ngo;
        if (organization_ids !== undefined) {
            const orgIds = Array.isArray(organization_ids)
                ? organization_ids.map((id) => Number(id)).filter((id) => !isNaN(id))
                : [];
            if (orgIds.length === 1) {
                organization_id = orgIds[0];
                multiNgo = false;
            }
            else if (orgIds.length > 1) {
                organization_id = null;
                multiNgo = true;
            }
            else {
                organization_id = null;
                multiNgo = false;
            }
            updateData.organization_id = organization_id;
            updateData.multi_ngo = multiNgo;
            // Update project_organization relationships
            yield (0, config_1.default)("project_organization").where({ project_id: id }).del();
            if (multiNgo && orgIds.length > 0) {
                const projectOrgRecords = orgIds.map((orgId) => ({
                    project_id: id,
                    organization_id: orgId,
                    created_at: new Date(),
                    updated_at: new Date(),
                }));
                yield (0, config_1.default)("project_organization").insert(projectOrgRecords);
            }
        }
        // Update the project
        yield (0, config_1.default)("project").where({ id }).update(updateData);
        const updatedProject = yield (0, config_1.default)("project").where({ id }).first();
        const donorUser = yield (0, config_1.default)("users").where({ id: userId }).first();
        const donorInfo = yield (0, config_1.default)("donors").where({ id: donor.id }).first();
        // Send notification email
        try {
            yield new mail_1.default({
                email: donorUser.email,
                url: "",
                token: 0,
                additionalData: {
                    subject: "Project Brief Updated",
                    projectTitle: updatedProject.title,
                    projectDescription: updatedProject.description,
                    budget: updatedProject.cost,
                    donorName: (donorInfo === null || donorInfo === void 0 ? void 0 : donorInfo.name) || "Donor",
                    state: updatedProject.state,
                    city: updatedProject.city,
                },
            }).sendEmail("donorbriefupdate", "Project Brief Updated");
        }
        catch (emailError) {
            console.error("Error sending project update notification email:", emailError);
        }
        res.status(200).json({
            status: "success",
            message: "Project details updated successfully",
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
                organization_id: updatedProject.organization_id,
                multi_ngo: updatedProject.multi_ngo,
                organization_ids: multiNgo ? organization_ids || [] : [],
                ispublic: updatedProject.ispublic,
                updatedAt: updatedProject.updatedAt,
            },
        });
    }
    catch (error) {
        console.error("Edit Project Error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while editing the project",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.editProject = editProject;
const getProjectApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { projectId } = req.params;
        const { status } = req.query;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!projectId) {
            res.status(400).json({
                status: "fail",
                error: "Project ID is required",
            });
            return;
        }
        const project = yield (0, config_1.default)("project")
            .where({ id: projectId })
            .select("id", "donor_id", "title", "category")
            .first();
        if (!project) {
            res.status(404).json({
                status: "fail",
                error: "Project not found",
            });
            return;
        }
        const donor = yield (0, config_1.default)("donors")
            .where({ user_id: userId })
            .select("id")
            .first();
        if (!donor || donor.id !== project.donor_id) {
            res.status(403).json({
                status: "fail",
                error: "You do not have permission to view applications for this project",
            });
            return;
        }
        let query = (0, config_1.default)("project_application")
            .where({ project_id: projectId })
            .leftJoin("organizations", "project_application.ngo_id", "organizations.id")
            .leftJoin("userimg", "organizations.user_id", "userimg.user_id")
            .leftJoin("address", "organizations.user_id", "address.user_id")
            .select("project_application.id", "project_application.project_id", "project_application.ngo_id", "project_application.applied_date", "project_application.proposed_budget", "project_application.timeline", "project_application.description", "project_application.deliverables", "project_application.status", "project_application.file_url", "project_application.createdAt", "project_application.updatedAt", "organizations.name as ngo_name", "organizations.phone", "organizations.website", "organizations.interest_area", "organizations.team_size", "organizations.user_id", "userimg.filename as ngo_image", "address.state", "address.city_lga", "address.address");
        const metricsResult = yield (0, config_1.default)("project_application")
            .where({ project_id: projectId })
            .select("status")
            .count("id as count")
            .groupBy("status");
        const metrics = {
            total: 0,
            pending: 0,
            accepted: 0,
            rejected: 0,
        };
        metricsResult.forEach((item) => {
            metrics.total += item.count;
            if (item.status === "pending") {
                metrics.pending = item.count;
            }
            else if (item.status === "accepted") {
                metrics.accepted = item.count;
            }
            else if (item.status === "rejected") {
                metrics.rejected = item.count;
            }
        });
        if (status) {
            query = query.where("project_application.status", status);
        }
        const applications = yield query.orderBy("project_application.createdAt", "desc");
        const enrichedApplications = yield Promise.all(applications.map((app) => __awaiter(void 0, void 0, void 0, function* () {
            const totalProjects = yield (0, config_1.default)("project")
                .where({ organization_id: app.ngo_id })
                .count("id as count")
                .first();
            const completedProjects = yield (0, config_1.default)("project")
                .where({ organization_id: app.ngo_id, status: "completed" })
                .count("id as count")
                .first();
            const totalProjectsCount = Number((totalProjects === null || totalProjects === void 0 ? void 0 : totalProjects.count) || 0);
            const completedProjectsCount = Number((completedProjects === null || completedProjects === void 0 ? void 0 : completedProjects.count) || 0);
            const completionPercentage = totalProjectsCount > 0
                ? parseFloat(((completedProjectsCount / totalProjectsCount) * 100).toFixed(2))
                : 0;
            let beneficiariesCount = 0;
            const ngoProjects = yield (0, config_1.default)("project")
                .where({ organization_id: app.ngo_id })
                .select("id");
            if (ngoProjects.length > 0) {
                const projectIds = ngoProjects.map((p) => p.id);
                const milestones = yield (0, config_1.default)("milestone")
                    .whereIn("project_id", projectIds)
                    .select("id");
                const milestoneIds = milestones.map((m) => m.id);
                if (milestoneIds.length > 0) {
                    const beneficiariesResult = yield (0, config_1.default)("milestone_update")
                        .whereIn("milestone_id", milestoneIds)
                        .count("id as count")
                        .first();
                    beneficiariesCount = Number((beneficiariesResult === null || beneficiariesResult === void 0 ? void 0 : beneficiariesResult.count) || 0);
                }
            }
            return Object.assign(Object.assign({}, app), { ngo_details: {
                    totalProjects: totalProjectsCount,
                    completedProjects: completedProjectsCount,
                    completionPercentage: completionPercentage,
                    beneficiaries: beneficiariesCount,
                    teamSize: app.team_size,
                    image: app.ngo_image,
                    interestArea: app.interest_area,
                    location: {
                        state: app.state,
                        city_lga: app.city_lga,
                        address: app.address,
                    },
                } });
        })));
        res.status(200).json({
            status: "success",
            count: enrichedApplications.length,
            projectId: projectId,
            projectTitle: project.title,
            metrics: metrics,
            data: enrichedApplications,
        });
    }
    catch (error) {
        console.error("Get Project Applications Error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while fetching project applications",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getProjectApplications = getProjectApplications;
const updateProjectApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { projectId, applicationId } = req.params;
        const { status } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!projectId || !applicationId) {
            res.status(400).json({
                status: "fail",
                error: "Project ID and Application ID are required",
            });
            return;
        }
        if (!status) {
            res.status(400).json({
                status: "fail",
                error: "Status is required",
            });
            return;
        }
        const validStatuses = ["pending", "accepted", "rejected"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({
                status: "fail",
                error: `Invalid status. Status must be one of: ${validStatuses.join(", ")}`,
            });
            return;
        }
        const project = yield (0, config_1.default)("project")
            .where({ id: projectId })
            .select("id", "donor_id", "title")
            .first();
        if (!project) {
            res.status(404).json({
                status: "fail",
                error: "Project not found",
            });
            return;
        }
        const donor = yield (0, config_1.default)("donors")
            .where({ user_id: userId })
            .select("id")
            .first();
        if (!donor || donor.id !== project.donor_id) {
            res.status(403).json({
                status: "fail",
                error: "You do not have permission to update applications for this project",
            });
            return;
        }
        const application = yield (0, config_1.default)("project_application")
            .where({ id: applicationId, project_id: projectId })
            .select("id", "project_id", "ngo_id", "status")
            .first();
        if (!application) {
            res.status(404).json({
                status: "fail",
                error: "Application not found",
            });
            return;
        }
        yield (0, config_1.default)("project_application").where({ id: applicationId }).update({
            status: status,
            updatedAt: new Date(),
        });
        if (status === "accepted") {
            const ngoId = application.ngo_id;
            const existingRecord = yield (0, config_1.default)("project_organization")
                .where({ project_id: projectId, organization_id: ngoId })
                .first();
            if (!existingRecord) {
                yield (0, config_1.default)("project_organization").insert({
                    project_id: projectId,
                    organization_id: ngoId,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
            yield (0, config_1.default)("project").where({ id: projectId }).update({
                multi_ngo: true,
                status: "active",
                updatedAt: new Date(),
            });
            try {
                const organization = yield (0, config_1.default)("organizations")
                    .where({ id: ngoId })
                    .first();
                if (organization && organization.user_id) {
                    const ngoUser = yield (0, config_1.default)("users")
                        .where({ id: organization.user_id })
                        .first();
                    const projectDetails = yield (0, config_1.default)("project")
                        .where({ id: projectId })
                        .first();
                    if (ngoUser && ngoUser.email) {
                        yield new mail_1.default({
                            email: ngoUser.email,
                            url: "",
                            token: 0,
                            additionalData: {
                                subject: "Your Application Has Been Accepted",
                                projectTitle: projectDetails.title,
                                projectDescription: projectDetails.description,
                                budget: projectDetails.cost,
                                ngoName: organization.name || "NGO",
                                state: projectDetails.state,
                                city: projectDetails.city,
                            },
                        }).sendEmail("ngoapplicationaccepted", "Your Application Has Been Accepted");
                        console.log(`Acceptance email sent to NGO: ${organization.name} (${ngoUser.email})`);
                    }
                }
            }
            catch (ngoEmailError) {
                console.error("Error sending application acceptance email to NGO:", ngoEmailError);
            }
        }
        const updatedApplication = yield (0, config_1.default)("project_application")
            .where("project_application.id", applicationId)
            .leftJoin("organizations", "project_application.ngo_id", "organizations.id")
            .leftJoin("userimg", "organizations.user_id", "userimg.user_id")
            .select("project_application.id", "project_application.project_id", "project_application.ngo_id", "project_application.applied_date", "project_application.proposed_budget", "project_application.timeline", "project_application.description", "project_application.deliverables", "project_application.status", "project_application.createdAt", "project_application.updatedAt", "organizations.name as ngo_name", "organizations.phone", "organizations.website", "organizations.user_id", "userimg.filename as ngo_image")
            .first();
        res.status(200).json({
            status: "success",
            message: `Application status updated to ${status} successfully`,
            data: updatedApplication,
        });
    }
    catch (error) {
        console.error("Update Project Application Status Error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while updating the application status",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateProjectApplicationStatus = updateProjectApplicationStatus;
const createMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, status = "in-progress", target, project_id, due_date, } = req.body;
        // const userId = (req.user as User)?.id;
        // Validate required fields
        if (!title || !description || !target || !project_id) {
            res.status(400).json({
                status: "fail",
                message: "Please provide title, description, target, and project_id",
            });
            return;
        }
        // Verify that the user owns the organization that owns this project
        const project = yield (0, config_1.default)("project").where({ id: project_id }).first();
        if (!project) {
            res.status(404).json({
                status: "fail",
                message: "Project not found",
            });
            return;
        }
        // Create the milestone
        const milestoneData = {
            milestone: title,
            description: description,
            status: status,
            target: target,
            project_id: project_id,
            due_date: due_date || null,
            createdAt: new Date(),
        };
        const [milestoneId] = yield (0, config_1.default)("milestone").insert(milestoneData);
        const createdMilestone = yield (0, config_1.default)("milestone")
            .where({ id: milestoneId })
            .first();
        res.status(201).json({
            status: "success",
            message: "Milestone created successfully",
            data: createdMilestone,
        });
    }
    catch (error) {
        console.error("Create milestone error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while creating the milestone",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createMilestone = createMilestone;
// Helper to fetch organization details
function fetchOrganizationsWithDetails(organizationIds, project, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!organizationIds.length)
            return [];
        const organizations = yield (0, config_1.default)("organizations")
            .whereIn("id", organizationIds)
            .select("id", "name", "phone", "website", "interest_area", "cac", "active", "is_verified", "user_id");
        return Promise.all(organizations.map((org) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const image = yield getUserImage(org.user_id);
            let allocated = null;
            let budget = null;
            if (project.multi_ngo) {
                const po = yield (0, config_1.default)("project_organization")
                    .where({ project_id: projectId, organization_id: org.id })
                    .select("budget")
                    .first();
                allocated = (_a = po === null || po === void 0 ? void 0 : po.allocated) !== null && _a !== void 0 ? _a : null;
                budget = (_b = po === null || po === void 0 ? void 0 : po.budget) !== null && _b !== void 0 ? _b : null;
            }
            else {
                allocated = (_c = project.allocated) !== null && _c !== void 0 ? _c : null;
            }
            return Object.assign(Object.assign(Object.assign({}, org), { image: (image === null || image === void 0 ? void 0 : image.filename) || null, allocated }), (project.multi_ngo ? { budget } : {}));
        })));
    });
}
const getProjectOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const idNum = Number(projectId);
        if (!projectId || isNaN(idNum)) {
            res.status(400).json({
                status: "fail",
                error: "Invalid or missing project ID",
            });
            return;
        }
        const project = yield (0, config_1.default)("project")
            .where({ id: idNum })
            .select("id", "title", "organization_id", "multi_ngo", "allocated")
            .first();
        if (!project) {
            res.status(404).json({
                status: "fail",
                error: "Project not found",
            });
            return;
        }
        let organizationIds = [];
        if (project.multi_ngo) {
            const projectOrganizations = yield (0, config_1.default)("project_organization")
                .where({ project_id: idNum })
                .select("organization_id");
            organizationIds = projectOrganizations.map((po) => po.organization_id);
        }
        else if (project.organization_id) {
            organizationIds = [project.organization_id];
        }
        const organizations = yield fetchOrganizationsWithDetails(organizationIds, project, idNum);
        res.status(200).json({
            status: "success",
            projectId: project.id,
            projectTitle: project.title,
            multiNgo: project.multi_ngo,
            organizationCount: organizations.length,
            data: organizations,
        });
        return;
    }
    catch (error) {
        console.error("Get project organizations error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while fetching project organizations",
            details: error instanceof Error ? error.message : "Unknown error",
        });
        return;
    }
});
exports.getProjectOrganizations = getProjectOrganizations;
const getProjectNgoBudget = (project, projectOrganization) => {
    const ngoBudget = Number((projectOrganization === null || projectOrganization === void 0 ? void 0 : projectOrganization.budget) || 0);
    if (ngoBudget > 0)
        return ngoBudget;
    const allocated = Number((projectOrganization === null || projectOrganization === void 0 ? void 0 : projectOrganization.allocated) || project.allocated || 0);
    if (allocated > 0)
        return allocated;
    return Number(project.cost || 0);
};
const buildPayoutRows = (project, organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    const projectOrganization = yield (0, config_1.default)("project_organization")
        .where({ project_id: project.id, organization_id: organizationId })
        .first();
    const budget = getProjectNgoBudget(project, projectOrganization);
    const milestones = yield (0, config_1.default)("milestone")
        .where({ project_id: project.id })
        .select("id", "milestone", "target", "description", "status", "due_date", "createdAt")
        .orderBy("createdAt", "asc");
    const payouts = yield (0, config_1.default)("project_ngo_payout")
        .where({ project_id: project.id, organization_id: organizationId })
        .select("id", "payout_type", "milestone_id", "amount", "status", "paid_at");
    const mobilizationPayout = payouts.find((payout) => payout.payout_type === "mobilization");
    const milestoneAmount = milestones.length > 0 ? (budget * 0.7) / milestones.length : 0;
    const milestoneRows = yield Promise.all(milestones.map((milestone) => __awaiter(void 0, void 0, void 0, function* () {
        const updates = yield (0, config_1.default)("milestone_update")
            .where({
            milestone_id: milestone.id,
            organization_id: organizationId,
        })
            .select("id", "status");
        const payout = payouts.find((item) => item.payout_type === "milestone" &&
            Number(item.milestone_id) === Number(milestone.id));
        return {
            type: "milestone",
            milestoneId: milestone.id,
            title: milestone.milestone,
            description: milestone.description,
            amount: Number((payout === null || payout === void 0 ? void 0 : payout.amount) || milestoneAmount),
            status: (payout === null || payout === void 0 ? void 0 : payout.status) || "unpaid",
            paidAt: (payout === null || payout === void 0 ? void 0 : payout.paid_at) || null,
            hasMilestoneUpdate: updates.length > 0,
            isUpdateApproved: updates.some((update) => String(update.status || "").toLowerCase() === "approved"),
        };
    })));
    return {
        budget,
        rows: [
            {
                type: "mobilization",
                milestoneId: null,
                title: "30% Mobilization fee",
                description: "Initial project mobilization payout",
                amount: Number((mobilizationPayout === null || mobilizationPayout === void 0 ? void 0 : mobilizationPayout.amount) || budget * 0.3),
                status: (mobilizationPayout === null || mobilizationPayout === void 0 ? void 0 : mobilizationPayout.status) || "unpaid",
                paidAt: (mobilizationPayout === null || mobilizationPayout === void 0 ? void 0 : mobilizationPayout.paid_at) || null,
                hasMilestoneUpdate: false,
                isUpdateApproved: false,
            },
            ...milestoneRows,
        ],
    };
});
const getProjectOrganizationFundingDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, organizationId } = req.params;
        const projectIdNum = Number(projectId);
        const organizationIdNum = Number(organizationId);
        if (!projectIdNum || !organizationIdNum) {
            res
                .status(400)
                .json({ status: "fail", error: "Invalid project or organization ID" });
            return;
        }
        const project = yield (0, config_1.default)("project").where({ id: projectIdNum }).first();
        if (!project) {
            res.status(404).json({ status: "fail", error: "Project not found" });
            return;
        }
        const organization = yield (0, config_1.default)("organizations")
            .leftJoin("users", "organizations.user_id", "users.id")
            .leftJoin("address", "organizations.user_id", "address.user_id")
            .where("organizations.id", organizationIdNum)
            .select("organizations.id", "organizations.name", "organizations.phone", "organizations.website", "organizations.interest_area", "organizations.cac", "organizations.description", "organizations.active", "organizations.is_verified", "organizations.user_id", "users.email", "address.address", "address.state", "address.city_lga")
            .first();
        if (!organization) {
            res.status(404).json({ status: "fail", error: "Organization not found" });
            return;
        }
        const isLinkedToProject = project.multi_ngo
            ? yield (0, config_1.default)("project_organization")
                .where({
                project_id: projectIdNum,
                organization_id: organizationIdNum,
            })
                .first()
            : Number(project.organization_id) === organizationIdNum;
        if (!isLinkedToProject) {
            res.status(404).json({
                status: "fail",
                error: "Organization is not selected for this project",
            });
            return;
        }
        const image = yield getUserImage(organization.user_id);
        const payoutData = yield buildPayoutRows(project, organizationIdNum);
        res.status(200).json({
            status: "success",
            project: {
                id: project.id,
                title: project.title,
                description: project.description,
                objectives: project.objectives,
                category: project.category,
                cost: project.cost,
                state: project.state,
                country: project.country,
                city: project.city,
                status: project.status,
            },
            organization: Object.assign(Object.assign({}, organization), { image: (image === null || image === void 0 ? void 0 : image.filename) || null }),
            budget: payoutData.budget,
            rows: payoutData.rows,
        });
    }
    catch (error) {
        console.error("Get project organization funding detail error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while fetching organization funding details",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getProjectOrganizationFundingDetail = getProjectOrganizationFundingDetail;
const payProjectOrganizationPayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { projectId, organizationId } = req.params;
        const { type, milestoneId } = req.body;
        const projectIdNum = Number(projectId);
        const organizationIdNum = Number(organizationId);
        const milestoneIdNum = milestoneId ? Number(milestoneId) : null;
        if (!userId || !projectIdNum || !organizationIdNum) {
            res.status(400).json({ status: "fail", error: "Invalid payout request" });
            return;
        }
        if (type !== "mobilization" && type !== "milestone") {
            res.status(400).json({ status: "fail", error: "Invalid payout type" });
            return;
        }
        if (type === "milestone" && !milestoneIdNum) {
            res
                .status(400)
                .json({ status: "fail", error: "milestoneId is required" });
            return;
        }
        const project = yield (0, config_1.default)("project").where({ id: projectIdNum }).first();
        if (!project) {
            res.status(404).json({ status: "fail", error: "Project not found" });
            return;
        }
        const isLinkedToProject = project.multi_ngo
            ? yield (0, config_1.default)("project_organization")
                .where({
                project_id: projectIdNum,
                organization_id: organizationIdNum,
            })
                .first()
            : Number(project.organization_id) === organizationIdNum;
        if (!isLinkedToProject) {
            res.status(404).json({
                status: "fail",
                error: "Organization is not selected for this project",
            });
            return;
        }
        const payoutData = yield buildPayoutRows(project, organizationIdNum);
        const row = payoutData.rows.find((item) => {
            if (type === "mobilization")
                return item.type === "mobilization";
            return (item.type === "milestone" && Number(item.milestoneId) === milestoneIdNum);
        });
        if (!row) {
            res.status(404).json({ status: "fail", error: "Payout row not found" });
            return;
        }
        if (row.status === "paid") {
            res
                .status(409)
                .json({ status: "fail", error: "Payout has already been paid" });
            return;
        }
        const [payoutId] = yield (0, config_1.default)("project_ngo_payout").insert({
            project_id: projectIdNum,
            organization_id: organizationIdNum,
            milestone_id: type === "milestone" ? milestoneIdNum : null,
            payout_type: type,
            amount: row.amount,
            status: "paid",
            paid_by_user_id: userId,
            paid_at: new Date(),
        });
        yield (0, config_1.default)("donations").insert({
            project_id: projectIdNum,
            ngo_id: organizationIdNum,
            donor_id: project.donor_id,
            type: type === "mobilization" ? "Mobilization Payout" : "Milestone Payout",
            amount: row.amount,
        });
        res.status(201).json({
            status: "success",
            message: "Payout recorded successfully",
            data: Object.assign(Object.assign({ id: payoutId }, row), { status: "paid", paidAt: new Date() }),
        });
    }
    catch (error) {
        console.error("Pay project organization payout error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while recording payout",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.payProjectOrganizationPayout = payProjectOrganizationPayout;
const deleteMilestoneUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { milestoneUpdateId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!milestoneUpdateId) {
            res.status(400).json({
                status: "fail",
                message: "Milestone update ID is required",
            });
            return;
        }
        if (!userId) {
            res.status(401).json({
                status: "fail",
                message: "User not authenticated",
            });
            return;
        }
        // Get the milestone update
        const milestoneUpdate = yield (0, config_1.default)("milestone_updates")
            .where({ id: milestoneUpdateId })
            .first();
        if (!milestoneUpdate) {
            res.status(404).json({
                status: "fail",
                message: "Milestone update not found",
            });
            return;
        }
        // Get the milestone to verify project ownership
        const milestone = yield (0, config_1.default)("milestone")
            .where({ id: milestoneUpdate.milestone_id })
            .first();
        if (!milestone) {
            res.status(404).json({
                status: "fail",
                message: "Milestone not found",
            });
            return;
        }
        // Get the project to verify user ownership
        const project = yield (0, config_1.default)("project")
            .where({ id: milestone.project_id })
            .first();
        if (!project) {
            res.status(404).json({
                status: "fail",
                message: "Project not found",
            });
            return;
        }
        // Get the organization to verify user is the owner
        const organization = yield (0, config_1.default)("organizations")
            .where({ id: project.organization_id })
            .first();
        if (!organization || organization.user_id !== userId) {
            res.status(403).json({
                status: "fail",
                message: "You do not have permission to delete this milestone update",
            });
            return;
        }
        // Delete the milestone update
        yield (0, config_1.default)("milestone_updates").where({ id: milestoneUpdateId }).del();
        res.status(200).json({
            status: "success",
            message: "Milestone update deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete milestone update error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while deleting the milestone update",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteMilestoneUpdate = deleteMilestoneUpdate;
const updateMilestoneUpdateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const milestoneUpdateId = Number(req.body.milestoneUpdateId);
        const status = String(req.body.status || "").toLowerCase();
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            res.status(401).json({
                status: "fail",
                message: "User not authenticated",
            });
            return;
        }
        if (!milestoneUpdateId || !["approved", "rejected"].includes(status)) {
            res.status(400).json({
                status: "fail",
                message: "A valid milestone update ID and an approved or rejected status are required",
            });
            return;
        }
        let milestoneUpdateQuery = (0, config_1.default)("milestone_update as milestoneUpdate")
            .join("milestone as milestone", "milestoneUpdate.milestone_id", "milestone.id")
            .join("project as project", "milestone.project_id", "project.id")
            .where("milestoneUpdate.id", milestoneUpdateId);
        if (String(user.role || "").toLowerCase() !== "admin") {
            const donor = yield (0, config_1.default)("donors")
                .where({ user_id: user.id })
                .select("id")
                .first();
            if (!donor) {
                res.status(403).json({
                    status: "fail",
                    message: "Only the project donor can review milestone updates",
                });
                return;
            }
            milestoneUpdateQuery = milestoneUpdateQuery.andWhere("project.donor_id", donor.id);
        }
        const milestoneUpdate = yield milestoneUpdateQuery
            .select("milestoneUpdate.id")
            .first();
        if (!milestoneUpdate) {
            res.status(404).json({
                status: "fail",
                message: "Milestone update not found for this project",
            });
            return;
        }
        yield (0, config_1.default)("milestone_update")
            .where({ id: milestoneUpdateId })
            .update({ status });
        const reviewedUpdate = yield (0, config_1.default)("milestone_update")
            .where({ id: milestoneUpdateId })
            .first();
        res.status(200).json({
            status: "success",
            message: `Milestone update ${status} successfully`,
            data: reviewedUpdate,
        });
    }
    catch (error) {
        console.error("Update milestone status error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while reviewing the milestone update",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateMilestoneUpdateStatus = updateMilestoneUpdateStatus;
const submitProposal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { projectId, coverLetter, deliverables } = req.body;
        // Validate required fields
        if (!projectId || !coverLetter || !deliverables) {
            res.status(400).json({
                status: "fail",
                error: "Project ID, cover letter, and deliverables are required",
            });
            return;
        }
        // Validate projectId exists
        const project = yield (0, config_1.default)("project")
            .where({ id: projectId })
            .select("id", "title")
            .first();
        if (!project) {
            res.status(404).json({
                status: "fail",
                error: "Project not found",
            });
            return;
        }
        // Get NGO ID from organizations table using user_id
        const organization = yield (0, config_1.default)("organizations")
            .where({ user_id: userId })
            .select("id")
            .first();
        if (!organization) {
            res.status(404).json({
                status: "fail",
                error: "Organization not found for this user",
            });
            return;
        }
        // Check if organization already applied for this project
        const existingApplication = yield (0, config_1.default)("project_application")
            .where({ project_id: projectId, ngo_id: organization.id })
            .first();
        if (existingApplication) {
            res.status(409).json({
                status: "fail",
                error: "Your organization has already applied for this project",
            });
            return;
        }
        // Get file URL from uploaded file if exists
        let fileUrl = null;
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            fileUrl = req.files[0].location;
        }
        // Parse deliverables array if it's a string
        let deliverablesList = deliverables;
        if (typeof deliverables === "string") {
            try {
                deliverablesList = JSON.parse(deliverables);
            }
            catch (_b) {
                deliverablesList = [deliverables];
            }
        }
        // Create project application
        const applicationData = {
            project_id: projectId,
            ngo_id: organization.id,
            description: coverLetter,
            deliverables: JSON.stringify(deliverablesList),
            file_url: fileUrl,
            applied_date: new Date(),
            proposed_budget: 0,
            timeline: 0,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const [applicationId] = yield (0, config_1.default)("project_application").insert(applicationData);
        // Fetch the created application with related data
        const createdApplication = yield (0, config_1.default)("project_application")
            .where({ id: applicationId })
            .select("id", "project_id", "ngo_id", "applied_date", "proposed_budget", "timeline", "description", "deliverables", "file_url", "status", "createdAt", "updatedAt")
            .first();
        res.status(201).json({
            status: "success",
            message: "Proposal submitted successfully",
            data: createdApplication,
        });
    }
    catch (error) {
        console.error("Submit Proposal Error:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while submitting the proposal",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.submitProposal = submitProposal;
const checkApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { projectId } = req.params;
        // Validate projectId
        if (!projectId) {
            res.status(400).json({
                status: "fail",
                error: "Project ID is required",
            });
            return;
        }
        // Get NGO ID from organizations table using user_id
        const organization = yield (0, config_1.default)("organizations")
            .where({ user_id: userId })
            .select("id")
            .first();
        if (!organization) {
            res.status(404).json({
                status: "fail",
                hasApplied: false,
            });
            return;
        }
        // Check if organization already applied for this project
        const existingApplication = yield (0, config_1.default)("project_application")
            .where({ project_id: projectId, ngo_id: organization.id })
            .first();
        res.status(200).json({
            status: "success",
            hasApplied: !!existingApplication,
        });
    }
    catch (error) {
        console.error("Error checking application status:", error);
        res.status(500).json({
            status: "fail",
            error: "An error occurred while checking application status",
            details: error instanceof Error ? error.message : "Unknown error",
            hasApplied: false,
        });
    }
});
exports.checkApplicationStatus = checkApplicationStatus;
