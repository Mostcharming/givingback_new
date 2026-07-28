"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const general_1 = require("../../middleware/general");
const donor_controller_1 = require("./donor.controller");
const router = express_1.default.Router();
router.get("/dashboard", donor_controller_1.getCountsHandler);
router.get("/users", donor_controller_1.getAllUsers);
router
    .route("/onboard")
    .post(auth_1.secureLogin, general_1.uploadimg, (0, general_1.uploadHandler)("userimg"), (0, general_1.uploadHandler)("cacidimage"), donor_controller_1.newDonor);
router
    .route("/onboardp")
    .post(general_1.uploadimg, (0, general_1.uploadHandler)("userimg"), donor_controller_1.newDonor);
router.post("/ngos/:id/message", donor_controller_1.sendMessageToNGO);
router.post("/project/:id/message", donor_controller_1.feedBack);
router
    .route("/beneficiary")
    .post(donor_controller_1.addRecipient)
    .get(donor_controller_1.getRecipient)
    .put(donor_controller_1.donate);
router.route("/users/:id/projects").get(donor_controller_1.getAllUserPresentProjects);
router.route("/projects").post(general_1.uploadimg, donor_controller_1.addbrief);
router.get("/messages", donor_controller_1.getMessage);
router.get("/messages/:id", donor_controller_1.updateMessage);
router.post("/messages_admin", donor_controller_1.sendMessageToAdmin);
exports.default = router;
