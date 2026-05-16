"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeCheckoutSuccess = exports.handleDonation = exports.stripeHandler = exports.makeDonation = exports.getAllNames = exports.getAllProjectsForAllUsers = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config"));
const getProjects_1 = require("../../helper/getProjects");
const mail_1 = __importDefault(require("../../utils/mail"));
function initializeStripe() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paymentGateway = yield (0, config_1.default)("payment_gateways")
                .select("secret_key")
                .where("name", "Stripe")
                .first();
            if (!paymentGateway || !paymentGateway.secret_key) {
                throw new Error("Stripe secret key not found in the database");
            }
            return new stripe_1.default(paymentGateway.secret_key, {
                apiVersion: "2024-12-18.acacia",
            });
        }
        catch (error) {
            console.error("Error initializing Stripe:", error.message);
            throw error;
        }
    });
}
const getAllProjectsForAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, donor_id, organization_id, projectType, title, description, objectives, category, scope, status, startDate, endDate, id, } = req.query;
        const filters = {
            donor_id: donor_id,
            organization_id: organization_id,
            projectType: projectType,
            title: title,
            description: description,
            objectives: objectives,
            category: category,
            scope: scope,
            status: status,
            startDate: startDate,
            endDate: endDate,
            id: id,
        };
        const { previousProjects, presentProjects } = yield (0, getProjects_1.getProjects)(config_1.default, filters, parseInt(page), parseInt(limit));
        const totalItems = previousProjects.length + presentProjects.length;
        const totalPages = Math.ceil(totalItems / parseInt(limit));
        res.status(200).json({
            projects: [...previousProjects, ...presentProjects],
            totalItems,
            totalPages,
            currentPage: parseInt(page),
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Unable to fetch all projects for all users" });
    }
});
exports.getAllProjectsForAllUsers = getAllProjectsForAllUsers;
const getAllNames = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const names = yield (0, config_1.default)("areas").select("id", "name");
        res.json(names);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch areas" });
    }
});
exports.getAllNames = getAllNames;
const makeDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payment_gateway, transactionId, amount, projectId, ngoId, type, currency, } = req.body;
        const missingFields = [];
        if (!payment_gateway)
            missingFields.push("payment_gateway");
        if (!transactionId)
            missingFields.push("transactionId");
        if (!amount)
            missingFields.push("amount");
        if (!projectId)
            missingFields.push("projectId");
        if (!ngoId)
            missingFields.push("ngoId");
        if (!type)
            missingFields.push("type");
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
            const rateEntry = yield (0, config_1.default)("rates").select("rate").first();
            if (!rateEntry) {
                res.status(500).json({ error: "Exchange rate not found." });
                return;
            }
            conversionRate = rateEntry.rate;
            amounts = amounts * conversionRate;
        }
        const trx = yield config_1.default.transaction();
        const [donationId] = yield trx("donations")
            .insert({
            amount: amounts,
            project_id: projectId,
            ngo_id: ngoId,
            type,
        })
            .returning("id");
        // Save the rate in the `donation_rates` table
        yield trx("donation_rates").insert({
            donation_id: donationId,
            rate: conversionRate,
        });
        yield trx("transactions").insert({
            donation_id: donationId,
            payment_gateway,
            status: "success",
            transaction_id: transactionId,
        });
        yield trx.commit();
        let userData = yield (0, config_1.default)("organizations").where("user_id", ngoId).first();
        if (!userData) {
            if (!userData) {
                userData = yield (0, config_1.default)("donors").where("user_id", ngoId).first();
            }
        }
        const userData2 = yield (0, config_1.default)("project").where("id", projectId).first();
        if (!userData2) {
            return res.status(404).json({
                status: "fail",
                message: "User not found.",
            });
        }
        const userDataE = yield (0, config_1.default)("users").where("id", ngoId).first();
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
        yield new mail_1.default({ email: email, url, token, additionalData }).sendEmail("donatengo", "Donation Received");
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url,
            token,
            additionalData,
        }).sendEmail("admindonate", "New Donation");
        res.status(200).json({ message: "Donation successful." });
    }
    catch (error) {
        res.status(500).json({ error: "Unable to process donation." });
    }
});
exports.makeDonation = makeDonation;
const stripeHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stripe = yield initializeStripe();
        const { amount, currency, success_url, cancel_url } = req.body;
        const missingFields = [];
        if (!amount)
            missingFields.push("amount");
        if (!currency)
            missingFields.push("currency");
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
        const session = yield stripe.checkout.sessions.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.stripeHandler = stripeHandler;
const handleDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, amount, payment_gateway, transactionId, currency } = req.body;
    let amounts = Number(amount);
    const trx = yield config_1.default.transaction();
    try {
        let conversionRate = 1;
        if (currency === "usd") {
            const rateEntry = yield (0, config_1.default)("rates").select("rate").first();
            if (!rateEntry) {
                res.status(500).json({ error: "Exchange rate not found." });
                yield trx.rollback();
                return;
            }
            conversionRate = rateEntry.rate;
            amounts = amounts * conversionRate;
        }
        let donor = yield (0, config_1.default)("donors").where({ user_id }).select("id").first();
        let donationId;
        // Check if the user is a donor first
        if (!donor) {
            // If not a donor, check if the user is an organization
            const organization = yield (0, config_1.default)("organizations")
                .where({ user_id })
                .select("id")
                .first();
            // If the user is an organization, insert the donation into the database with the NGO ID
            if (organization) {
                [donationId] = yield trx("donations")
                    .insert({
                    amount: amounts,
                    ngo_id: organization.id,
                    type: "Wallet fund",
                })
                    .returning("id");
            }
            else {
                // Handle the case where neither donor nor organization is found
                return res.status(404).json({ error: "User not found." });
            }
        }
        else {
            [donationId] = yield trx("donations")
                .insert({
                amount: amounts,
                donor_id: donor.id,
                type: "Wallet fund",
            })
                .returning("id");
        }
        yield trx("donation_rates").insert({
            donation_id: donationId,
            rate: conversionRate,
        });
        yield trx("transactions").insert({
            donation_id: donationId,
            payment_gateway,
            status: "success",
            transaction_id: transactionId,
        });
        yield trx("wallet").where("user_id", user_id).increment("balance", amounts);
        yield trx.commit();
        let userData = yield (0, config_1.default)("organizations").where("user_id", user_id).first();
        if (!userData) {
            userData = yield (0, config_1.default)("donors").where("user_id", user_id).first();
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
        yield new mail_1.default({ email: email, url, token, additionalData }).sendEmail("fundngo", "Funding Received");
        yield new mail_1.default({
            email: "info@givingbackng.org",
            url,
            token,
            additionalData,
        }).sendEmail("adminwallet", "New Funding");
        res.status(200).json({
            message: "Donation and transaction processed successfully.",
            donation_id: donationId,
        });
    }
    catch (error) {
        console.log(error);
        yield trx.rollback();
        res.status(500).json({ error: "Unable to process donation." });
    }
});
exports.handleDonation = handleDonation;
const handleStripeCheckoutSuccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { sessionId, status, user_id, amount } = req.body;
    if (!sessionId) {
        return res.status(400).json({ error: "Missing session_id" });
    }
    const trx = yield config_1.default.transaction();
    try {
        const stripe = yield initializeStripe();
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
            let amounts = ((_a = session.amount_total) !== null && _a !== void 0 ? _a : 0) / 100;
            let conversionRate = 1;
            const transactionId = session.payment_intent;
            const rateEntry = yield (0, config_1.default)("rates").select("rate").first();
            if (!rateEntry) {
                res.status(500).json({ error: "Exchange rate not found." });
                yield trx.rollback();
                return;
            }
            conversionRate = rateEntry.rate;
            amounts = amounts * conversionRate;
            let donor = yield (0, config_1.default)("donors").where({ user_id }).select("id").first();
            let donationId;
            // Check if the user is a donor first
            if (!donor) {
                // If not a donor, check if the user is an organization
                const organization = yield (0, config_1.default)("organizations")
                    .where({ user_id })
                    .select("id")
                    .first();
                // If the user is an organization, insert the donation into the database with the NGO ID
                if (organization) {
                    [donationId] = yield trx("donations")
                        .insert({
                        amount: amounts,
                        ngo_id: organization.id,
                        type: "Wallet fund",
                    })
                        .returning("id");
                }
                else {
                    // Handle the case where neither donor nor organization is found
                    return res.status(404).json({ error: "User not found." });
                }
            }
            else {
                [donationId] = yield trx("donations")
                    .insert({
                    amount: amounts,
                    donor_id: donor.id,
                    type: "Wallet fund",
                })
                    .returning("id");
            }
            yield trx("donation_rates").insert({
                donation_id: donationId,
                rate: conversionRate,
            });
            yield trx("transactions").insert({
                donation_id: donationId,
                payment_gateway: "Stripe",
                status: "success",
                transaction_id: transactionId,
            });
            yield trx("wallet")
                .where("user_id", user_id)
                .increment("balance", amounts);
            yield trx.commit();
            let userData = yield (0, config_1.default)("organizations")
                .where("user_id", user_id)
                .first();
            if (!userData) {
                userData = yield (0, config_1.default)("donors").where("user_id", user_id).first();
            }
            const userDataE = yield (0, config_1.default)("users").where("id", user_id).first();
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
            yield new mail_1.default({ email: email, url, token, additionalData }).sendEmail("fundngo", "Funding Received");
            yield new mail_1.default({
                email: "info@givingbackng.org",
                url,
                token,
                additionalData,
            }).sendEmail("adminwallet", "New Funding");
            res.json({
                success: true,
                message: "Stripe checkout verfied and completed",
            });
        }
        else {
            return res.json({ success: false, status: session.payment_status });
        }
    }
    catch (error) {
        console.error("Stripe verification error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.handleStripeCheckoutSuccess = handleStripeCheckoutSuccess;
