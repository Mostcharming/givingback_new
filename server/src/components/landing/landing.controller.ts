import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import db from "../../config";
import { getProjects } from "../../helper/getProjects";
import Email from "../../utils/mail";

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
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      donor_id,
      organization_id,
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
      parseInt(limit as string)
    );

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
  next: NextFunction
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
      // Fetch the rate from the `rates` table
      const rateEntry = await db("rates").select("rate").first();
      if (!rateEntry) {
        res.status(500).json({ error: "Exchange rate not found." });
        return;
      }
      conversionRate = rateEntry.rate;
      amounts = amounts * conversionRate;
    }

    const trx = await db.transaction();

    const [donationId] = await trx("donations")
      .insert({
        amount: amounts,
        project_id: projectId,
        ngo_id: ngoId,
        type,
      })
      .returning("id");

    // Save the rate in the `donation_rates` table
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

    await trx.commit();

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
      "Donation Received"
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
  res: Response
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

  const trx = await db.transaction();
  try {
    let conversionRate = 1;
    if (currency === "usd") {
      const rateEntry = await db("rates").select("rate").first();
      if (!rateEntry) {
        res.status(500).json({ error: "Exchange rate not found." });
        await trx.rollback();
        return;
      }
      conversionRate = rateEntry.rate;
      amounts = amounts * conversionRate;
    }

    let donor = await db("donors").where({ user_id }).select("id").first();
    let donationId: any;

    // Check if the user is a donor first
    if (!donor) {
      // If not a donor, check if the user is an organization
      const organization = await db("organizations")
        .where({ user_id })
        .select("id")
        .first();

      // If the user is an organization, insert the donation into the database with the NGO ID
      if (organization) {
        [donationId] = await trx("donations")
          .insert({
            amount: amounts,
            ngo_id: organization.id,
            type: "Wallet fund",
          })
          .returning("id");
      } else {
        // Handle the case where neither donor nor organization is found
        return res.status(404).json({ error: "User not found." });
      }
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
      payment_gateway,
      status: "success",
      transaction_id: transactionId,
    });

    await trx("wallet").where("user_id", user_id).increment("balance", amounts);

    await trx.commit();

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
      "Funding Received"
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
    await trx.rollback();
    res.status(500).json({ error: "Unable to process donation." });
  }
};

export const handleStripeCheckoutSuccess = async (
  req: Request,
  res: Response
) => {
  const { sessionId, status, user_id, amount } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  const trx = await db.transaction();

  try {
    const stripe = await initializeStripe();

    const session = await stripe.checkout.sessions.retrieve(
      sessionId as string
    );

    if (session.payment_status === "paid") {
      let amounts = (session.amount_total ?? 0) / 100;
      let conversionRate = 1;
      const transactionId = session.payment_intent;
      const rateEntry = await db("rates").select("rate").first();
      if (!rateEntry) {
        res.status(500).json({ error: "Exchange rate not found." });
        await trx.rollback();
        return;
      }
      conversionRate = rateEntry.rate;
      amounts = amounts * conversionRate;

      let donor = await db("donors").where({ user_id }).select("id").first();
      let donationId: any;

      // Check if the user is a donor first
      if (!donor) {
        // If not a donor, check if the user is an organization
        const organization = await db("organizations")
          .where({ user_id })
          .select("id")
          .first();

        // If the user is an organization, insert the donation into the database with the NGO ID
        if (organization) {
          [donationId] = await trx("donations")
            .insert({
              amount: amounts,
              ngo_id: organization.id,
              type: "Wallet fund",
            })
            .returning("id");
        } else {
          // Handle the case where neither donor nor organization is found
          return res.status(404).json({ error: "User not found." });
        }
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

      await trx.commit();

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
        "Funding Received"
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
    } else {
      return res.json({ success: false, status: session.payment_status });
    }
  } catch (error) {
    console.error("Stripe verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
