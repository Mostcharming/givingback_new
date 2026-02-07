import express from "express";
import { secureLogin, verifyLogin, verifyNewUser } from "../../middleware/auth";

import { uploadbulk, uploadimg } from "../../middleware/general";
import {
  addSingleNGO,
  bulkUploadNGOsEndpoint,
  changePassword,
  createMilestone,
  createProject,
  deleteBank,
  downloadSampleNGOFile,
  editProject,
  forgotPassword,
  getAllOrganizations,
  getDonorProjectMetrics,
  getDonorProjects,
  getOne,
  getOrganizationCounts,
  getProjectApplications,
  getProjectOrganizations,
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
router.post("/new/onboard", uploadimg, verifyNewUser, onboard as any);
router.route("/verify").post(verify).put(secureLogin, resend);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

router.use(secureLogin);

router.get("/logout", logout);
router.get("/", getOne);
router.get("/organization-counts", getOrganizationCounts);
router.get("/donor/project-stats", getDonorProjectMetrics);
router.get("/donor/projects", getDonorProjects);
router.post("/donor/projects", createProject);
router.put("/donor/projects/:id", editProject);
router.put("/donor/projects/:id/publish", publishProjectBrief);
router.get("/donor/projects/:projectId/applications", getProjectApplications);
router.put(
  "/donor/projects/:projectId/applications/:applicationId/status",
  updateProjectApplicationStatus
);
router.put("/", uploadimg, updateOne);
router.post("/changepassword", changePassword);
router.delete("/bank/:id", deleteBank);
router.get("/organizations", getAllOrganizations);

router.post("/organizations", addSingleNGO as any);
router.get("/bulk/sample", downloadSampleNGOFile);
router.post("/bulk/upload", uploadbulk, bulkUploadNGOsEndpoint);
router.post("/milestones", createMilestone);
router.get("/projects/:projectId/organizations", getProjectOrganizations);

export default router;
