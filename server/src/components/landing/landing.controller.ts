import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import db from "../../config";
import { getProjects } from "../../helper/getProjects";
import Email from "../../utils/mail";
import { getUsdToNgnRate } from "../../utils/rateUtils";

class UserNotFoundError extends Error {}

async function initializeStripe() {
  try {
    const paymentGateway = await db("payment_gateways")
      .select("secret_key")
      .where("name", "Stripe")
      .first();

    if (!paymentGateway || !paymentGateway.secret_key) {
      throw new Error("Stripe secret key not found in the database");
    }

    return new Stripe(paymentGateway.secret_key, {
      apiVersion: "2024-12-18.acacia",
    });
  } catch (error: any) {
    console.error("Error initializing Stripe:", error.message);
    throw error;
  }
}

export const getAllProjectsForAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = 1,
      limit = 10,
      donor_id,
      organization_id,
      ngo_id,
      projectType,
      title,
      description,
      objectives,
      category,
      scope,
      status,
      state,
      startDate,
      endDate,
      id,
    } = req.query;

    const filters = {
      donor_id: donor_id as string,
      organization_id: organization_id as string,
      ngo_id: ngo_id as string,
      projectType: projectType as "present" | "previous",
      title: title as string,
      description: description as string,
      objectives: objectives as string,
      category: category as string,
      scope: scope as string,
      status: status as string,
      state: state as string,
      startDate: startDate as string,
      endDate: endDate as string,
      id: id as unknown as number,
    };

    const { previousProjects, presentProjects } = await getProjects(
      db,
      filters,
      parseInt(page as string),
      parseInt(limit as string),
    );

    // If id filter was provided and no projects found, return error
    if (id && previousProjects.length === 0 && presentProjects.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const totalItems = previousProjects.length + presentProjects.length;
    const totalPages = Math.ceil(totalItems / parseInt(limit as string));

    res.status(200).json({
      projects: [...previousProjects, ...presentProjects],
      totalItems,
      totalPages,
      currentPage: parseInt(page as string),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch all projects for all users" });
  }
};

export const getAllNames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const names = await db("areas").select("id", "name");
    const sortedNames = names.sort((a, b) => a.name.localeCompare(b.name));
    res.json(sortedNames);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch areas" });
  }
};

export const makeDonation = async (req: Request, res: any): Promise<void> => {
  try {
    const {
      payment_gateway,
      transactionId,
      amount,
      projectId,
      ngoId,
      type,
      currency,
    } = req.body;

    const missingFields: string[] = [];
    if (!payment_gateway) missingFields.push("payment_gateway");
    if (!transactionId) missingFields.push("transactionId");
    if (!amount) missingFields.push("amount");
    if (!projectId) missingFields.push("projectId");
    if (!ngoId) missingFields.push("ngoId");
    if (!type) missingFields.push("type");

    if (missingFields.length > 0) {
      res.status(400).json({
        status: "fail",
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      return;
    }

    let amounts = Number(amount);
    let conversionRate = 1; // Default rate for NGN

    if (currency === "usd") {
      conversionRate = await getUsdToNgnRate();
      amounts = amounts * conversionRate;
    }

    await db.transaction(async (trx) => {
      const [donationId] = await trx("donations")
        .insert({
          amount: amounts,
          project_id: projectId,
          ngo_id: ngoId,
          type,
        })
        .returning("id");

      await trx("donation_rates").insert({
        donation_id: donationId,
        rate: conversionRate,
      });

      await trx("transactions").insert({
        donation_id: donationId,
        payment_gateway,
        status: "success",
        transaction_id: transactionId,
      });
    });

    let userData = await db("organizations").where("user_id", ngoId).first();
    if (!userData) {
      if (!userData) {
        userData = await db("donors").where("user_id", ngoId).first();
      }
    }
    const userData2 = await db("project").where("id", projectId).first();
    if (!userData2) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }
    const userDataE = await db("users").where("id", ngoId).first();
    const email = userDataE.email;

    const token = 0;
    const url = userData.name;
    const additionalData = {
      projectTitle: userData2.title,
      currency: currency,
      transactionId: transactionId,
      ngoName: userData.name,
      amount: amount,
    };

    await new Email({ email: email, url, token, additionalData }).sendEmail(
      "donatengo",
      "Donation Received",
    );
    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("admindonate", "New Donation");
    res.status(200).json({ message: "Donation successful." });
  } catch (error) {
    res.status(500).json({ error: "Unable to process donation." });
  }
};

export const stripeHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stripe = await initializeStripe();

    const { amount, currency, success_url, cancel_url } = req.body;

    const missingFields: string[] = [];
    if (!amount) missingFields.push("amount");
    if (!currency) missingFields.push("currency");

    if (missingFields.length > 0) {
      res.status(400).json({
        status: "fail",
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      return;
    }

    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency,
    // });

    // res.json({
    //   wholeResponse: paymentIntent,
    //   clientSecret: paymentIntent.client_secret,
    // });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "GivingBack",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: success_url,
      cancel_url: cancel_url,
    });
    res.json({
      sessionId: session.id,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleDonation = async (req: Request, res: any): Promise<void> => {
  const { user_id, amount, payment_gateway, transactionId, currency } =
    req.body;
  let amounts = Number(amount);

  try {
    let conversionRate = 1;
    if (currency === "usd") {
      conversionRate = await getUsdToNgnRate();
      amounts = amounts * conversionRate;
    }

    const donationId = await db.transaction(async (trx) => {
      const donor = await trx("donors")
        .where({ user_id })
        .select("id")
        .first();
      let insertedDonationId: any;

      if (!donor) {
        const organization = await trx("organizations")
          .where({ user_id })
          .select("id")
          .first();

        if (!organization) {
          throw new UserNotFoundError("User not found.");
        }

        [insertedDonationId] = await trx("donations")
          .insert({
            amount: amounts,
            ngo_id: organization.id,
            type: "Wallet fund",
          })
          .returning("id");
      } else {
        [insertedDonationId] = await trx("donations")
          .insert({
            amount: amounts,
            donor_id: donor.id,
            type: "Wallet fund",
          })
          .returning("id");
      }

      await trx("donation_rates").insert({
        donation_id: insertedDonationId,
        rate: conversionRate,
      });

      await trx("transactions").insert({
        donation_id: insertedDonationId,
        payment_gateway,
        status: "success",
        transaction_id: transactionId,
      });

      await trx("wallet")
        .where("user_id", user_id)
        .increment("balance", amounts);

      return insertedDonationId;
    });

    let userData = await db("organizations").where("user_id", user_id).first();
    if (!userData) {
      userData = await db("donors").where("user_id", user_id).first();
    }

    const email = userData.email;

    const token = 0;
    const url = userData.name;
    const additionalData = {
      currency: currency,
      transactionId: transactionId,
      ngoName: userData.name,
      userName: userData.name,
      amount: amount,
    };

    await new Email({ email: email, url, token, additionalData }).sendEmail(
      "fundngo",
      "Funding Received",
    );
    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("adminwallet", "New Funding");
    res.status(200).json({
      message: "Donation and transaction processed successfully.",
      donation_id: donationId,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof UserNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Unable to process donation." });
  }
};

export const handleStripeCheckoutSuccess = async (
  req: Request,
  res: Response,
) => {
  const { sessionId, status, user_id, amount } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    const stripe = await initializeStripe();

    const session = await stripe.checkout.sessions.retrieve(
      sessionId as string,
    );

    if (session.payment_status !== "paid") {
      return res.json({ success: false, status: session.payment_status });
    }

    let amounts = (session.amount_total ?? 0) / 100;
    const conversionRate = await getUsdToNgnRate();
    const transactionId = session.payment_intent;
    amounts = amounts * conversionRate;

    await db.transaction(async (trx) => {
      const donor = await trx("donors")
        .where({ user_id })
        .select("id")
        .first();
      let donationId: any;

      if (!donor) {
        const organization = await trx("organizations")
          .where({ user_id })
          .select("id")
          .first();

        if (!organization) {
          throw new UserNotFoundError("User not found.");
        }

        [donationId] = await trx("donations")
          .insert({
            amount: amounts,
            ngo_id: organization.id,
            type: "Wallet fund",
          })
          .returning("id");
      } else {
        [donationId] = await trx("donations")
          .insert({
            amount: amounts,
            donor_id: donor.id,
            type: "Wallet fund",
          })
          .returning("id");
      }

      await trx("donation_rates").insert({
        donation_id: donationId,
        rate: conversionRate,
      });

      await trx("transactions").insert({
        donation_id: donationId,
        payment_gateway: "Stripe",
        status: "success",
        transaction_id: transactionId,
      });

      await trx("wallet")
        .where("user_id", user_id)
        .increment("balance", amounts);
    });

    let userData = await db("organizations")
      .where("user_id", user_id)
      .first();
    if (!userData) {
      userData = await db("donors").where("user_id", user_id).first();
    }

    const userDataE = await db("users").where("id", user_id).first();
    const email = userDataE.email;

    const token = 0;
    const url = userData.name;
    const additionalData = {
      currency: "usd",
      transactionId: transactionId,
      ngoName: userData.name,
      userName: userData.name,
      amount: amount,
    };

    await new Email({ email: email, url, token, additionalData }).sendEmail(
      "fundngo",
      "Funding Received",
    );
    await new Email({
      email: "info@givingbackng.org",
      url,
      token,
      additionalData,
    }).sendEmail("adminwallet", "New Funding");
    res.json({
      success: true,
      message: "Stripe checkout verfied and completed",
    });
  } catch (error) {
    console.error("Stripe verification error:", error);
    if (error instanceof UserNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
