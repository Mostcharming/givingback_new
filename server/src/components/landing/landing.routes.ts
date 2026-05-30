import express from "express";

import {
  getAllNames,
  getAllProjectsForAllUsers,
  handleDonation,
  handleStripeCheckoutSuccess,
  makeDonation,
  stripeHandler,
} from "./landing.controller";

const router = express.Router();

router.get("/allprojects", getAllProjectsForAllUsers);
router.get("/areas", getAllNames);

router.route("/donate").post(makeDonation);
router.route("/fund").post(handleDonation);
router.route("/verify-stripe-payment").post(handleStripeCheckoutSuccess as any);

router.route("/stripe_session").post(stripeHandler);

export default router;
