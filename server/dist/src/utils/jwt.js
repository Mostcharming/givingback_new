"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
// Function to sign the token
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
// Function to create and send token
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user.id);
    res.cookie("giveback", token, {
        expires: new Date(Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    user.password = undefined;
    user.token = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
    // Update `first_time_login` to false if it was true
    if (user.first_time_login) {
        (0, config_1.default)("users")
            .where({ id: user.id })
            .update({ first_time_login: false })
            .catch((err) => {
            console.error("Failed to update first_time_login:", err);
        });
    }
};
exports.createSendToken = createSendToken;
