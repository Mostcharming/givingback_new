"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
// Function to generate OTP
const generateOtp = (digit) => {
    const otp = otp_generator_1.default.generate(digit, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
    return parseInt(otp, 10);
};
exports.generateOtp = generateOtp;
