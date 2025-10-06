import db from "../config";

interface Counts {
  completedProjectsCount: any;
  activeProjectsCount: any;
  totalDonations: string;
  walletBalance: string;
}

export const getCounts = async (
  userId: number,
  isDonor: boolean,
  orgId?: string,
  donorId?: string
): Promise<Counts> => {
  const completedProjectsCount = isDonor
    ? await db("project")
        .where("status", "completed")
        .andWhere("donor_id", donorId)
        .count("id as count")
        .first()
    : await db("project")
        .where("organization_id", orgId)
        .andWhere("status", "completed")
        .count("id as count")
        .first();

  const activeProjectsCount = isDonor
    ? await db("project")
        .where("status", "active")
        .andWhere("donor_id", donorId)
        .count("id as count")
        .first()
    : await db("project")
        .where("organization_id", orgId)
        .andWhere("status", "active")
        .count("id as count")
        .first();

  const totalDonations = isDonor
    ? await db("donations")
        .where("donor_id", donorId)
        .sum("amount as total")
        .first()
    : await db("donations")
        .where("ngo_id", orgId)
        .sum("amount as total")
        .first();

  const walletBalance = await db("wallet")
    .where("user_id", userId)
    .select("balance")
    .first();

  const formattedTotalDonations = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(totalDonations?.total || 0);

  const formattedWalletBalance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(walletBalance?.balance || 0);

  return {
    completedProjectsCount: completedProjectsCount?.count || 0,
    activeProjectsCount: activeProjectsCount?.count || 0,
    totalDonations: formattedTotalDonations,
    walletBalance: formattedWalletBalance,
  };
};
