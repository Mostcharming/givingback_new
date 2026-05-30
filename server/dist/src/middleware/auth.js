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
exports.secureLogin = exports.verifyNewUser = exports.verifyLogin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
// Define the shape of user requests
const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;
const verifyLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(422).json({ error: 'All fields are required' });
            return;
        }
        const user = yield (0, config_1.default)('users').where({ email }).first();
        if (!user) {
            res.status(404).json({ error: 'Invalid Login Credentials' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.verifyLogin = verifyLogin;
// Middleware to verify a new user
const verifyNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(422).json({ error: 'All fields are required' });
            return;
        }
        const user = yield (0, config_1.default)('users').where({ email }).first();
        if (user) {
            res.status(422).json({ error: 'User already exists' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.verifyNewUser = verifyNewUser;
// Middleware to secure login
const secureLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.giveback;
        if (!token && ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer'))) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res
                .status(401)
                .json({ error: 'You are not logged in! Please log in to get access.' });
            return;
        }
        const decoded = yield (0, exports.verifyToken)(token, process.env.JWT_SECRET);
        const user = yield (0, config_1.default)('users')
            .select('id', 'role')
            .where({ id: decoded.id })
            .first();
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        req.user = { id: user.id, role: user.role };
        next();
    }
    catch (error) {
        res.status(401).json({
            error: error.message
        });
    }
});
exports.secureLogin = secureLogin;
