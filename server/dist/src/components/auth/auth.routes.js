"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const general_1 = require("../../middleware/general");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
// Route to sign up a new user
router.post("/signup", auth_1.verifyNewUser, auth_controller_1.signup);
// Route to log in a user
router.post("/login", auth_1.verifyLogin, auth_controller_1.login);
// Route to log out a user
router.get("/logout", auth_controller_1.logout);
router.post("/new/onboard", general_1.uploadimg, auth_1.verifyNewUser, auth_controller_1.onboard);
// Routes for verifying and resending
router.route("/verify").post(auth_1.secureLogin, auth_controller_1.verify).put(auth_1.secureLogin, auth_controller_1.resend);
router.post("/forgotpassword", auth_controller_1.forgotPassword);
router.post("/resetpassword", auth_controller_1.resetPassword);
// Route to get user details (requires secure login)
router.get("/", auth_1.secureLogin, auth_controller_1.getOne);
// Route to change password (requires secure login)
router.post("/changepassword", auth_1.secureLogin, auth_controller_1.changePassword);
exports.default = router;
