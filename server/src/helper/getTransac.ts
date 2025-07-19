import db from "../config";

export const fetchDonations = async (filters: {
  page?: number;
  limit?: number;
  project_id?: number;
  ngo_id?: number;
  donor_id?: number;
  type?: string;
  min_amount?: number;
  max_amount?: number;
  payment_gateway?: string;
  status?: string;
}): Promise<{
  donations: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}> => {
  const {
    page = 1,
    limit = 10,
    project_id,
    ngo_id,
    donor_id,
    type,
    min_amount,
    max_amount,
    payment_gateway,
    status,
  } = filters;

  const offset = (page - 1) * limit;

  // Build the base query for donations
  let query = db("donations")
    .leftJoin("project", "donations.project_id", "project.id") // Use left join to keep donations without a project
    .leftJoin("transactions", "donations.id", "transactions.donation_id")
    .leftJoin("donation_rates", "donations.id", "donation_rates.donation_id")
    .leftJoin(
      "donation_messages",
      "donations.id",
      "donation_messages.donation_id"
    )
    .select(
      "donations.id",
      "donations.amount",
      "donations.project_id",
      "donations.ngo_id",
      "donations.donor_id",
      "donations.createdAt",
      "donations.type",
      db.raw('IFNULL(project.title, "") as project_name'), // Return empty string if no project title
      db.raw('IFNULL(project.description, "") as project_description'), // Return empty string if no project description
      "transactions.status",
      "transactions.transaction_id"
    )
    .orderBy("createdAt", "desc");
  // Apply filters
  if (project_id) query = query.where("donations.project_id", project_id);
  if (ngo_id) query = query.where("donations.ngo_id", ngo_id);
  if (donor_id) query = query.where("donations.donor_id", donor_id);
  if (type) query = query.where("donations.type", "LIKE", `%${type}%`);
  if (min_amount)
    query = query.whereRaw("CAST(donations.amount AS DECIMAL(10, 2)) >= ?", [
      min_amount,
    ]);
  if (max_amount)
    query = query.whereRaw("CAST(donations.amount AS DECIMAL(10, 2)) <= ?", [
      max_amount,
    ]);
  if (payment_gateway)
    query = query.where("transactions.payment_gateway", payment_gateway);
  if (status) query = query.where("transactions.status", status);

  const allDonations: any[] = await query;

  // Add additional details for each donation
  const donationDetails = [];

  for (const donation of allDonations) {
    // Fetch donation rates
    const rates = await db("donation_rates")
      .where({ donation_id: donation.id })
      .select("rate");

    // Fetch donation messages
    const messages = await db("donation_messages")
      .where({ donation_id: donation.id })
      .select("subject", "message");

    // Add to donationDetails
    donationDetails.push({
      ...donation,
      rates: rates.map((rate) => rate.rate),
      messages: messages.map((msg) => ({
        subject: msg.subject,
        message: msg.message,
      })),
    });
  }

  // Paginate results
  const paginatedDonations = donationDetails.slice(offset, offset + limit);
  const totalItems = donationDetails.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    donations: paginatedDonations,
    totalItems,
    totalPages,
    currentPage: page,
  };
};
