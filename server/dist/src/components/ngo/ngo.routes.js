"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createBankandAddress_1 = require("../../helper/createBankandAddress");
const general_1 = require("../../middleware/general");
const ngo_controller_1 = require("./ngo.controller");
const router = express_1.default.Router();
router.route("/onboard").post(general_1.uploadimg, (0, general_1.uploadHandler)("userimg"), (0, general_1.uploadHandler)("cacidimage"), createBankandAddress_1.createAddress, createBankandAddress_1.createBank, (0, general_1.verifyNew)("organizations", "cac"), ngo_controller_1.create);
router.route("/previous-project").post(general_1.uploadimg, ngo_controller_1.createp);
router.route("/milestone").post(general_1.uploadimg, ngo_controller_1.addMilestoneUpdate);
router.route("/withdraw_request").post(ngo_controller_1.withdraw);
router.route("/projects/:id").put(ngo_controller_1.respondBrief);
router.route("/project_v2").post(general_1.uploadimg, ngo_controller_1.createProject);
router.route("/project/:project_id/milestones").post(ngo_controller_1.addMilestones);
// Add Sponsors
router.route("/project/:project_id/sponsors").post(general_1.uploadimg, ngo_controller_1.addSponsors);
// Add Beneficiaries
router.route("/project/:project_id/beneficiaries").post(ngo_controller_1.addBeneficiaries);
// Add Images
router.route("/project/:project_id/images").post(general_1.uploadimg, ngo_controller_1.addProjectImages);
// Remove single milestone
router.route("/milestone/:milestone_id").delete(ngo_controller_1.deleteMilestone);
// Remove single sponsor
router.route("/sponsor/:sponsor_id").delete(ngo_controller_1.deleteSponsor);
// Remove single beneficiary
router.route("/beneficiary/:beneficiary_id").delete(ngo_controller_1.deleteBeneficiary);
// Remove single image
router.route("/image/:image_id").delete(ngo_controller_1.deleteImage);
exports.default = router;
