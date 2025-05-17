import express from "express";
import { secureLogin } from "../middleware/auth";
import adminRoute from "./admin/admin.routes";
import authRoute from "./auth/auth.routes";
import communityRoute from "./community/community.routes";
import contactRoute from "./contact_us/contact.routes";
import donorRoute from "./donor/donor.routes";
import landingRoute from "./landing/landing.routes";
import ngoRoute from "./ngo/ngo.routes";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/", contactRoute);
router.use("/", landingRoute);
router.use("/community", communityRoute);

router.use("/donor", secureLogin, donorRoute);
router.use("/ngo", secureLogin, ngoRoute);
router.use("/admin", secureLogin, adminRoute);

export default router;
