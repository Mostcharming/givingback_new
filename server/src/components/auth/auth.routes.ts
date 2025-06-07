import express from "express";
import { secureLogin, verifyLogin, verifyNewUser } from "../../middleware/auth";

import { uploadimg } from "../../middleware/general";
import {
  changePassword,
  forgotPassword,
  getOne,
  login,
  logout,
  onboard,
  resend,
  signup,
  verify,
} from "./auth.controller";

const router = express.Router();

// Route to sign up a new user
router.post("/signup", verifyNewUser, signup);

// Route to log in a user
router.post("/login", verifyLogin, login);

// Route to log out a user
router.get("/logout", logout);

router.post("/new/onboard", uploadimg, verifyNewUser, onboard as any);

// Routes for verifying and resending
router.route("/verify").post(secureLogin, verify).put(secureLogin, resend);

router.post("/forgotpassword", forgotPassword);

// Route to get user details (requires secure login)
router.get("/", secureLogin, getOne);

// Route to change password (requires secure login)
router.post("/changepassword", secureLogin, changePassword);

export default router;
