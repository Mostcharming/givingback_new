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
exports.getCounts = void 0;
const config_1 = __importDefault(require("../config"));
const calculateTrendPercentage = (current, previous) => {
    if (previous === 0)
        return 0;
    return ((current - previous) / previous) * 100;
};
const formatCurrency = (amount) => {
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
const getCounts = (userId, isDonor, orgId, donorId) => __awaiter(void 0, void 0, void 0, function* () {
    if (isDonor) {
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthRange = getLastMonthDateRange();
        const currentMonthDisbursed = yield (0, config_1.default)("donations")
            .where("donor_id", donorId)
            .andWhere("type", "Donated")
            .andWhere(config_1.default.raw("DATE(createdAt) >= ?", [firstDayThisMonth]))
            .sum("amount as total")
            .first();
        const lastMonthDisbursed = yield (0, config_1.default)("donations")
            .where("donor_id", donorId)
            .andWhere("type", "Donated")
            .andWhereBetween("createdAt", [lastMonthRange.start, lastMonthRange.end])
            .sum("amount as total")
            .first();
        const currentDisbursedAmount = Number((currentMonthDisbursed === null || currentMonthDisbursed === void 0 ? void 0 : currentMonthDisbursed.total) || 0);
        const lastMonthDisbursedAmount = Number((lastMonthDisbursed === null || lastMonthDisbursed === void 0 ? void 0 : lastMonthDisbursed.total) || 0);
        const disbursedTrend = calculateTrendPercentage(currentDisbursedAmount, lastMonthDisbursedAmount);
        const currentMonthNgos = yield (0, config_1.default)("organizations")
            .where("donor_id", donorId)
            .andWhere(config_1.default.raw("DATE(created_at) >= ?", [firstDayThisMonth]))
            .count("id as count")
            .first();
        const lastMonthNgos = yield (0, config_1.default)("organizations")
            .where("donor_id", donorId)
            .andWhereBetween("created_at", [lastMonthRange.start, lastMonthRange.end])
            .count("id as count")
            .first();
        const currentNgosCount = Number((currentMonthNgos === null || currentMonthNgos === void 0 ? void 0 : currentMonthNgos.count) || 0);
        const lastMonthNgosCount = Number((lastMonthNgos === null || lastMonthNgos === void 0 ? void 0 : lastMonthNgos.count) || 0);
        const ngosTrend = calculateTrendPercentage(currentNgosCount, lastMonthNgosCount);
        const currentMonthActiveProjects = yield (0, config_1.default)("project")
            .where("donor_id", donorId)
            .andWhere("status", "active")
            .andWhere(config_1.default.raw("DATE(createdAt) >= ?", [firstDayThisMonth]))
            .count("id as count")
            .first();
        const lastMonthActiveProjects = yield (0, config_1.default)("project")
            .where("donor_id", donorId)
            .andWhere("status", "active")
            .andWhereBetween("createdAt", [lastMonthRange.start, lastMonthRange.end])
            .count("id as count")
            .first();
        const currentActiveProjectsCount = Number((currentMonthActiveProjects === null || currentMonthActiveProjects === void 0 ? void 0 : currentMonthActiveProjects.count) || 0);
        const lastMonthActiveProjectsCount = Number((lastMonthActiveProjects === null || lastMonthActiveProjects === void 0 ? void 0 : lastMonthActiveProjects.count) || 0);
        const activeProjectsTrend = calculateTrendPercentage(currentActiveProjectsCount, lastMonthActiveProjectsCount);
        const donorProjects = yield (0, config_1.default)("project")
            .where("donor_id", donorId)
            .select("id");
        let currentMonthBeneficiaries = 0;
        let lastMonthBeneficiaries = 0;
        if (donorProjects.length > 0) {
            const projectIds = donorProjects.map((p) => p.id);
            const milestones = yield (0, config_1.default)("milestone")
                .whereIn("project_id", projectIds)
                .select("id");
            const milestoneIds = milestones.map((m) => m.id);
            if (milestoneIds.length > 0) {
                const currentBeneficiariesResult = yield (0, config_1.default)("milestone_update")
                    .whereIn("milestone_id", milestoneIds)
                    .andWhere(config_1.default.raw("DATE(createdAt) >= ?", [firstDayThisMonth]))
                    .count("id as count")
                    .first();
                const lastMonthBeneficiariesResult = yield (0, config_1.default)("milestone_update")
                    .whereIn("milestone_id", milestoneIds)
                    .andWhereBetween("createdAt", [
                    lastMonthRange.start,
                    lastMonthRange.end,
                ])
                    .count("id as count")
                    .first();
                currentMonthBeneficiaries = Number((currentBeneficiariesResult === null || currentBeneficiariesResult === void 0 ? void 0 : currentBeneficiariesResult.count) || 0);
                lastMonthBeneficiaries = Number((lastMonthBeneficiariesResult === null || lastMonthBeneficiariesResult === void 0 ? void 0 : lastMonthBeneficiariesResult.count) || 0);
            }
        }
        const beneficiariesTrend = calculateTrendPercentage(currentMonthBeneficiaries, lastMonthBeneficiaries);
        const donorWalletBalance = yield (0, config_1.default)("wallet")
            .where("user_id", userId)
            .select("balance")
            .first();
        const formattedDonorWalletBalance = formatCurrency((donorWalletBalance === null || donorWalletBalance === void 0 ? void 0 : donorWalletBalance.balance) || 0);
        const totalAllocatedResult = yield (0, config_1.default)("project")
            .where("donor_id", donorId)
            .sum("cost as total")
            .first();
        const formattedTotalAllocated = formatCurrency(Number((totalAllocatedResult === null || totalAllocatedResult === void 0 ? void 0 : totalAllocatedResult.total) || 0));
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
            walletBalance: formattedDonorWalletBalance,
            totalAllocated: formattedTotalAllocated,
        };
    }
    else {
        const completedProjectsCount = yield (0, config_1.default)("project")
            .where("organization_id", orgId)
            .andWhere("status", "completed")
            .count("id as count")
            .first();
        const activeProjectsCount = yield (0, config_1.default)("project")
            .where("organization_id", orgId)
            .andWhere("status", "active")
            .count("id as count")
            .first();
        const totalDonations = yield (0, config_1.default)("donations")
            .where("ngo_id", orgId)
            .sum("amount as total")
            .first();
        const walletBalance = yield (0, config_1.default)("wallet")
            .where("user_id", userId)
            .select("balance")
            .first();
        const formattedTotalDonations = formatCurrency((totalDonations === null || totalDonations === void 0 ? void 0 : totalDonations.total) || 0);
        const formattedWalletBalance = formatCurrency((walletBalance === null || walletBalance === void 0 ? void 0 : walletBalance.balance) || 0);
        return {
            completedProjectsCount: (completedProjectsCount === null || completedProjectsCount === void 0 ? void 0 : completedProjectsCount.count) || 0,
            activeProjectsCount: (activeProjectsCount === null || activeProjectsCount === void 0 ? void 0 : activeProjectsCount.count) || 0,
            totalDonations: formattedTotalDonations,
            walletBalance: formattedWalletBalance,
        };
    }
});
exports.getCounts = getCounts;
