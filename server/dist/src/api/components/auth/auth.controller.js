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
exports.changePassword = exports.deactivate = exports.resetPassword = exports.forgotPassword = exports.getOne = exports.resend = exports.logout = exports.login = exports.verify = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../../config"));
const general_1 = require("../../../middleware/general");
const jwt_1 = require("../../../utils/jwt");
const mail_1 = __importDefault(require("../../../utils/mail"));
const otp_1 = require("../../../utils/otp");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password, uuid } = req.body;
    const mail = email.trim();
    let newUser;
    try {
        if (uuid === 'giveback') {
            newUser = {
                email: mail,
                password: uuid,
                status: 1,
                active: 1,
                token: 0
            };
        }
        else if (uuid === 'donor' || uuid === 'google-donor') {
            newUser = {
                email: mail,
                password: (0, general_1.hash)(password.trim()),
                role: 'donor',
                active: 1,
                token: (0, otp_1.generateOtp)(6)
            };
        }
        else if (uuid === 'corporate') {
            if (!password) {
                res
                    .status(400)
                    .json({ error: 'Password is required for corporate role' });
                return;
            }
            newUser = {
                email: mail,
                password: (0, general_1.hash)(password.trim()),
                role: 'corporate',
                active: 1,
                token: (0, otp_1.generateOtp)(6)
            };
        }
        else {
            newUser = {
                email: mail,
                password: (0, general_1.hash)(password.trim()),
                active: 1,
                token: (0, otp_1.generateOtp)(6)
            };
        }
        const [id] = yield (0, config_1.default)('users').insert(newUser);
        const user = yield (0, config_1.default)('users').where({ id }).first();
        if (uuid !== 'giveback' && uuid !== 'google-donor') {
            const token = (_a = newUser.token) !== null && _a !== void 0 ? _a : 0;
            const url = '';
            yield new mail_1.default({ email: mail, url, token }).sendEmail('welcome', 'Welcome to the GivingBack Family!');
        }
        (0, jwt_1.createSendToken)(user, 200, req, res);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while signing up' });
    }
});
exports.signup = signup;
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const otp = Number(req.body.otp);
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield (0, config_1.default)('users').where({ id }).first();
    if (otp === (user === null || user === void 0 ? void 0 : user.token)) {
        yield (0, config_1.default)('users').update({ status: 1, token: 0 }).where({ id });
        res.status(200).json('Email Verified');
        return;
    }
    else {
        res.status(400).json({ error: 'Invalid OTP' });
        return;
    }
});
exports.verify = verify;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password: rawPassword, uuid } = req.body;
    const user = yield (0, config_1.default)('users').where({ email }).first();
    if (!user) {
        res.status(400).json({ error: 'User not found' });
        return;
    }
    if (user.active === 0) {
        res.status(400).json({
            error: 'Your account has been deactivated, Please contact Admin'
        });
        return;
    }
    if (uuid === 'giveback') {
        return (0, jwt_1.createSendToken)(user, 200, req, res);
    }
    const passwordIsValid = rawPassword && (yield bcryptjs_1.default.compare(rawPassword, user.password));
    if (!passwordIsValid) {
        res.status(400).json({ error: 'Invalid Login Credentials' });
        return;
    }
    (0, jwt_1.createSendToken)(user, 200, req, res);
});
exports.login = login;
const logout = (req, res) => {
    res.cookie('giveback', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};
exports.logout = logout;
const resend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield (0, config_1.default)('users').where({ id: userId }).first();
    if (user) {
        const newToken = (0, otp_1.generateOtp)(6);
        yield (0, config_1.default)('users').where({ id: userId }).update({ token: newToken });
        const userEmail = user.email;
        const url = '';
        yield new mail_1.default({ email: userEmail, url, token: newToken }).sendEmail('welcome', 'Welcome to the GivingBack Family!');
        res.status(200).json({ status: 'success' });
    }
    else {
        res.status(404).json({ status: 'error', error: 'User not found' });
    }
});
exports.resend = resend;
// Utility functions remain unchanged
const getBank = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, config_1.default)('banks')
        .where({ user_id: userId })
        .select('bankName', 'accountName', 'accountNumber', 'bvn');
});
const getAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, config_1.default)('address')
        .where({ user_id: userId })
        .select('state', 'city_lga', 'address');
});
const getOrCreateWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield (0, config_1.default)('wallet').where({ user_id: userId }).first();
    if (!wallet) {
        yield (0, config_1.default)('wallet').insert({
            user_id: userId,
            balance: 0.0,
            currency: 'NGN'
        });
        wallet = yield (0, config_1.default)('wallet').where({ user_id: userId }).first();
    }
    return wallet;
});
const getUserImage = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userImage = yield (0, config_1.default)('userimg').where({ user_id: userId }).first();
    return userImage || null;
});
function getTotalProjectsCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalProjectsCount = yield (0, config_1.default)('project')
            .where({ organization_id: userId })
            .count('id as totalCount')
            .first();
        return totalProjectsCount.totalCount || 0;
    });
}
function getActiveProjectsCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const activeProjectsCount = yield (0, config_1.default)('project')
            .where({ organization_id: userId, status: 'active' })
            .count('id as activeCount')
            .first();
        return activeProjectsCount.activeCount || 0;
    });
}
function getDonationsCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const donationsCount = yield (0, config_1.default)('donations')
            .where({ ngo_id: userId })
            .count('donations.id as donationCount')
            .first();
        return donationsCount.donationCount || 0;
    });
}
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    let user = yield (0, config_1.default)('organizations')
        .where({ user_id: id })
        .select('id', 'name', 'phone', 'website', 'interest_area', 'cac', 'active')
        .first();
    if (!user) {
        user = yield (0, config_1.default)('donors')
            .where({ user_id: id })
            .select('id', 'name', 'phoneNumber', 'industry', 'email', 'interest_area', 'state', 'city_lga', 'address', 'about', 'image', 'additional_information')
            .first();
        const userImage = yield getUserImage(id);
        const wallet = yield getOrCreateWallet(id);
        if (!user) {
            res.status(404).json({ error: 'User not associated with any account' });
            return;
        }
        res.status(200).json({ user, userImage, wallet });
        return;
    }
    const bank = yield getBank(id);
    const address = yield getAddress(id);
    const userImage = yield getUserImage(id);
    const allProjectsCount = yield getTotalProjectsCount(id);
    const activeProjectsCount = yield getActiveProjectsCount(id);
    const donationsCount = yield getDonationsCount(id);
    const wallet = yield getOrCreateWallet(id);
    res.status(200).json({
        user,
        bank,
        address,
        userImage,
        allProjectsCount,
        activeProjectsCount,
        donationsCount,
        wallet
    });
});
exports.getOne = getOne;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const token = (0, otp_1.generateOtp)(9);
    const user = yield (0, config_1.default)('users').update({ token }).where({ email });
    if (!user) {
        res
            .status(404)
            .json({ error: 'There is no user associated with this email address' });
        return;
    }
    const url = `${req.protocol}://givebackng.org/resetPassword/${token}`;
    yield new mail_1.default({ email, url, token }).sendEmail('passwordReset', 'Your password reset token');
    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const password = (0, general_1.hash)(req.body.password.trim());
    const user = yield (0, config_1.default)('users').update({ password, token: 0 }).where({ token });
    if (!user) {
        res.status(400).json({ error: 'Token is invalid' });
        return;
    }
    res.status(200).json({ message: 'Password successfully changed' });
});
exports.resetPassword = resetPassword;
const deactivate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, config_1.default)('users')
        .update({ active: 0 })
        .where({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    res.status(200).json({ status: 'success' });
});
exports.deactivate = deactivate;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { oldPassword, newPassword } = req.body;
    const user = yield (0, config_1.default)('users')
        .where({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
        .first();
    if (!user) {
        res.status(400).json({ error: 'User not found' });
        return;
    }
    const passwordIsValid = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!passwordIsValid) {
        res.status(400).json({ error: 'Old password is incorrect' });
        return;
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, 12);
    yield (0, config_1.default)('users').where({ id: user.id }).update({ password: user.password });
    res.status(200).json({
        status: 'success',
        message: 'Password has been changed successfully!'
    });
    return;
});
exports.changePassword = changePassword;
