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
const html_to_text_1 = require("html-to-text");
const nodemailer_1 = __importDefault(require("nodemailer"));
const pug_1 = __importDefault(require("pug"));
class Email {
    constructor({ email, url, token, additionalData }) {
        this.to = email;
        this.url = url;
        this.token = token;
        this.additionalData = additionalData || {};
        this.from = `GivingBack <${process.env.EMAIL_FROM}>`;
    }
    // Create a transport instance for sending emails
    createTransport() {
        const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
        if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
            throw new Error('Email environment variables are not properly configured.');
        }
        return nodemailer_1.default.createTransport({
            host: EMAIL_HOST,
            port: 2525,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });
    }
    // Generate email HTML and text content
    generateEmailContent(template, subject) {
        const html = pug_1.default.renderFile(`${__dirname}/../views/email/${template}.pug`, Object.assign({ url: this.url, token: this.token, email: this.to, subject }, this.additionalData));
        const text = (0, html_to_text_1.convert)(html);
        return { html, text };
    }
    // Generic method to send an email
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const { html, text } = this.generateEmailContent(template, subject);
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject,
                html,
                text
            };
            yield this.createTransport().sendMail(mailOptions);
        });
    }
    // Public method to send an email using a template
    sendEmail(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send(template, subject);
        });
    }
}
exports.default = Email;
