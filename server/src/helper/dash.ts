import db from "../config";

interface MetricTrend {
  value: string | number;
  trend: number;
  isUp: boolean;
}

interface DonorCounts {
  totalFundDisbursed: MetricTrend;
  ngosOnboarded: MetricTrend;
  activeProjects: MetricTrend;
  totalBeneficiaries: MetricTrend;
}

interface OrgCounts {
  completedProjectsCount: any;
  activeProjectsCount: any;
  totalDonations: string;
  walletBalance: string;
}

type Counts = DonorCounts | OrgCounts;

const calculateTrendPercentage = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

const getLastMonthDateRange = () => {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(firstDayThisMonth.getTime() - 1);

  return {
    start: firstDayLastMonth,
    end: lastDayLastMonth,
  };
};

export const getCounts = async (
  userId: number,
  isDonor: boolean,
  orgId?: string,
  donorId?: string
): Promise<Counts> => {
  if (isDonor) {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthRange = getLastMonthDateRange();

    const currentMonthDisbursed = await db("donations")
      .where("donor_id", donorId)
      .andWhere("type", "Donated")
      .andWhere(db.raw("DATE(createdAt) >= ?", [firstDayThisMonth]))
      .sum("amount as total")
      .first();

    const lastMonthDisbursed = await db("donations")
      .where("donor_id", donorId)
      .andWhere("type", "Donated")
      .andWhereBetween("createdAt", [lastMonthRange.start, lastMonthRange.end])
      .sum("amount as total")
      .first();

    const currentDisbursedAmount = Number(currentMonthDisbursed?.total || 0);
    const lastMonthDisbursedAmount = Number(lastMonthDisbursed?.total || 0);
    const disbursedTrend = calculateTrendPercentage(
      currentDisbursedAmount,
      lastMonthDisbursedAmount
    );

    const currentMonthNgos = await db("organizations")
      .where("donor_id", donorId)
      .andWhere(db.raw("DATE(created_at) >= ?", [firstDayThisMonth]))
      .count("id as count")
      .first();

    const lastMonthNgos = await db("organizations")
      .where("donor_id", donorId)
      .andWhereBetween("created_at", [lastMonthRange.start, lastMonthRange.end])
      .count("id as count")
      .first();

    const currentNgosCount = Number(currentMonthNgos?.count || 0);
    const lastMonthNgosCount = Number(lastMonthNgos?.count || 0);
    const ngosTrend = calculateTrendPercentage(
      currentNgosCount,
      lastMonthNgosCount
    );

    const currentMonthActiveProjects = await db("project")
      .where("donor_id", donorId)
      .andWhere("status", "active")
      .andWhere(db.raw("DATE(createdAt) >= ?", [firstDayThisMonth]))
      .count("id as count")
      .first();

    const lastMonthActiveProjects = await db("project")
      .where("donor_id", donorId)
      .andWhere("status", "active")
      .andWhereBetween("createdAt", [lastMonthRange.start, lastMonthRange.end])
      .count("id as count")
      .first();

    const currentActiveProjectsCount = Number(
      currentMonthActiveProjects?.count || 0
    );
    const lastMonthActiveProjectsCount = Number(
      lastMonthActiveProjects?.count || 0
    );
    const activeProjectsTrend = calculateTrendPercentage(
      currentActiveProjectsCount,
      lastMonthActiveProjectsCount
    );

    const donorProjects = await db("project")
      .where("donor_id", donorId)
      .select("id");

    let currentMonthBeneficiaries = 0;
    let lastMonthBeneficiaries = 0;

    if (donorProjects.length > 0) {
      const projectIds = donorProjects.map((p) => p.id);

      const milestones = await db("milestone")
        .whereIn("project_id", projectIds)
        .select("id");

      const milestoneIds = milestones.map((m) => m.id);

      if (milestoneIds.length > 0) {
        const currentBeneficiariesResult = await db("milestone_update")
          .whereIn("milestone_id", milestoneIds)
          .andWhere(db.raw("DATE(createdAt) >= ?", [firstDayThisMonth]))
          .count("id as count")
          .first();

        const lastMonthBeneficiariesResult = await db("milestone_update")
          .whereIn("milestone_id", milestoneIds)
          .andWhereBetween("createdAt", [
            lastMonthRange.start,
            lastMonthRange.end,
          ])
          .count("id as count")
          .first();

        currentMonthBeneficiaries = Number(
          currentBeneficiariesResult?.count || 0
        );
        lastMonthBeneficiaries = Number(
          lastMonthBeneficiariesResult?.count || 0
        );
      }
    }

    const beneficiariesTrend = calculateTrendPercentage(
      currentMonthBeneficiaries,
      lastMonthBeneficiaries
    );

    return {
      totalFundDisbursed: {
        value: formatCurrency(currentDisbursedAmount),
        trend: parseFloat(disbursedTrend.toFixed(2)),
        isUp: disbursedTrend >= 0,
      },
      ngosOnboarded: {
        value: currentNgosCount,
        trend: parseFloat(ngosTrend.toFixed(2)),
        isUp: ngosTrend >= 0,
      },
      activeProjects: {
        value: currentActiveProjectsCount,
        trend: parseFloat(activeProjectsTrend.toFixed(2)),
        isUp: activeProjectsTrend >= 0,
      },
      totalBeneficiaries: {
        value: currentMonthBeneficiaries,
        trend: parseFloat(beneficiariesTrend.toFixed(2)),
        isUp: beneficiariesTrend >= 0,
      },
    } as DonorCounts;
  } else {
    const completedProjectsCount = await db("project")
      .where("organization_id", orgId)
      .andWhere("status", "completed")
      .count("id as count")
      .first();

    const activeProjectsCount = await db("project")
      .where("organization_id", orgId)
      .andWhere("status", "active")
      .count("id as count")
      .first();

    const totalDonations = await db("donations")
      .where("ngo_id", orgId)
      .sum("amount as total")
      .first();

    const walletBalance = await db("wallet")
      .where("user_id", userId)
      .select("balance")
      .first();

    const formattedTotalDonations = formatCurrency(totalDonations?.total || 0);

    const formattedWalletBalance = formatCurrency(walletBalance?.balance || 0);

    return {
      completedProjectsCount: completedProjectsCount?.count || 0,
      activeProjectsCount: activeProjectsCount?.count || 0,
      totalDonations: formattedTotalDonations,
      walletBalance: formattedWalletBalance,
    } as OrgCounts;
  }
};
