import express from "express";
import { sendSupportEmail } from "./support.controller";

const router = express.Router();

router.post("/send_support", sendSupportEmail);

export default router;
