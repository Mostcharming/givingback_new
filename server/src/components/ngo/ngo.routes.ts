import express from "express";

import { createAddress, createBank } from "../../helper/createBankandAddress";
import { uploadHandler, uploadimg, verifyNew } from "../../middleware/general";
import {
  addBeneficiaries,
  addMilestones,
  addMilestoneUpdate,
  addProjectImages,
  addSponsors,
  create,
  createp,
  createProject,
  deleteBeneficiary,
  deleteImage,
  deleteMilestone,
  deleteSponsor,
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

router.route("/project_v2").post(uploadimg, createProject as any);
router.route("/project/:project_id/milestones").post(addMilestones as any);

// Add Sponsors
router.route("/project/:project_id/sponsors").post(uploadimg, addSponsors);

// Add Beneficiaries
router.route("/project/:project_id/beneficiaries").post(addBeneficiaries);

// Add Images
router.route("/project/:project_id/images").post(uploadimg, addProjectImages);

// Remove single milestone
router.route("/milestone/:milestone_id").delete(deleteMilestone);

// Remove single sponsor
router.route("/sponsor/:sponsor_id").delete(deleteSponsor as any);

// Remove single beneficiary
router.route("/beneficiary/:beneficiary_id").delete(deleteBeneficiary as any);

// Remove single image
router.route("/image/:image_id").delete(deleteImage as any);

export default router;
