import express from "express";
import { secureLogin, verifyLogin, verifyNewUser } from "../../middleware/auth";

import { uploadbulk, uploadimg } from "../../middleware/general";
import {
  addSingleNGO,
  bulkUploadNGOsEndpoint,
  changePassword,
  createProject,
  deleteBank,
  downloadSampleNGOFile,
  forgotPassword,
  getAllOrganizations,
  getDonorProjectMetrics,
  getDonorProjects,
  getOne,
  getOrganizationCounts,
  getProjectApplications,
  login,
  logout,
  onboard,
  publishProjectBrief,
  resend,
  resetPassword,
  signup,
  updateOne,
  updateProjectApplicationStatus,
  verify,
} from "./auth.controller";

const router = express.Router();

router.post("/signup", verifyNewUser, signup);

router.post("/login", verifyLogin, login);

router.get("/logout", logout);

router.post("/new/onboard", uploadimg, verifyNewUser, onboard as any);

router.route("/verify").post(verify).put(secureLogin, resend);

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

router.get("/", secureLogin, getOne);

router.get("/organization-counts", secureLogin, getOrganizationCounts);

router.get("/donor/project-stats", secureLogin, getDonorProjectMetrics);

router.get("/donor/projects", secureLogin, getDonorProjects);

router.post("/donor/projects", secureLogin, createProject);

router.put("/donor/projects/:id/publish", secureLogin, publishProjectBrief);

router.get(
  "/donor/projects/:projectId/applications",
  secureLogin,
  getProjectApplications
);

router.put(
  "/donor/projects/:projectId/applications/:applicationId/status",
  secureLogin,
  updateProjectApplicationStatus
);

router.put("/", secureLogin, uploadimg, updateOne);

router.post("/changepassword", secureLogin, changePassword);

router.delete("/bank/:id", secureLogin, deleteBank);

router.get("/organizations", secureLogin, getAllOrganizations);

// NGO Management Routes
router.post("/organizations", addSingleNGO as any);
router.get("/bulk/sample", downloadSampleNGOFile);
router.post("/bulk/upload", uploadbulk, bulkUploadNGOsEndpoint);

export default router;
