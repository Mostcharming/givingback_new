import express from "express";

import { createAddress, createBank } from "../../helper/createBankandAddress";
import { uploadHandler, uploadimg, verifyNew } from "../../middleware/general";
import {
  addMilestoneUpdate,
  create,
  createp,
  respondBrief,
  withdraw,
} from "./ngo.controller";

const router = express.Router();

router.route("/onboard").post(
  uploadimg,
  uploadHandler("userimg"),
  uploadHandler("cacidimage"),
  createAddress as any,
  createBank as any,

  verifyNew("organizations", "cac"),

  create as any
);
router.route("/previous-project").post(uploadimg, createp as any);
router.route("/milestone").post(uploadimg, addMilestoneUpdate as any);
router.route("/withdraw_request").post(withdraw as any);

router.route("/projects/:id").put(respondBrief as any);

export default router;
