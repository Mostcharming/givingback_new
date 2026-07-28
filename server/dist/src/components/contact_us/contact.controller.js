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
exports.sendContactEmail = void 0;
const mail_1 = __importDefault(require("../../utils/mail"));
const sendContactEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message, phoneNumber } = req.body;
    try {
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url: "",
            token: 0,
            additionalData: {
                name,
                email,
                message,
                phoneNumber,
            },
        }).sendEmail("contactForm", "New contact message");
        res.status(200).json({
            status: "success",
            message: "Your message has been sent successfully!",
        });
    }
    catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({
            error: "There was an error sending your message. Please try again later.",
        });
    }
});
exports.sendContactEmail = sendContactEmail;
