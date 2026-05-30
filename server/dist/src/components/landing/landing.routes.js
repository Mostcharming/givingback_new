"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const landing_controller_1 = require("./landing.controller");
const router = express_1.default.Router();
router.get("/allprojects", landing_controller_1.getAllProjectsForAllUsers);
router.get("/areas", landing_controller_1.getAllNames);
router.route("/donate").post(landing_controller_1.makeDonation);
router.route("/fund").post(landing_controller_1.handleDonation);
router.route("/verify-stripe-payment").post(landing_controller_1.handleStripeCheckoutSuccess);
router.route("/stripe_session").post(landing_controller_1.stripeHandler);
exports.default = router;
