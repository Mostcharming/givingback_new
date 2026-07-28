"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const general_1 = require("../../middleware/general");
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.get("/dashboard", admin_controller_1.getCounts);
router.route("/users/:id").post(admin_controller_1.updateUserByAdmin);
router.route("/bulk").get(admin_controller_1.sample).post(general_1.uploadbulk, admin_controller_1.bulk);
router.route("/transactions").get(admin_controller_1.getDonations);
router.post("/project/:id/message", admin_controller_1.feedBack);
router.route("/previous-project/:id").post(admin_controller_1.updateProject);
router.get("/payment-gateways", admin_controller_1.getPaymentGateways);
// Add a new payment gateway
router.post("/payment-gateways", admin_controller_1.addPaymentGateway);
// Update a payment gateway
router.put("/payment-gateways/:id", admin_controller_1.updatePaymentGateway);
// Delete a payment gateway
router.delete("/payment-gateways/:id", admin_controller_1.deletePaymentGateway);
router.get("/rates", admin_controller_1.getRates);
router.post("/rates", admin_controller_1.addRates);
router
    .route("/donor")
    // .post(secureLogin, uploadimg, verifyNewUser, admin.createDonor)
    .get(admin_controller_1.getAllDonors);
router.post("/projects", general_1.uploadimg, admin_controller_1.createProject);
exports.default = router;
