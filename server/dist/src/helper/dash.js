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
const getCounts = (userId, isDonor, orgId) => __awaiter(void 0, void 0, void 0, function* () {
    const completedProjectsCount = isDonor
        ? yield (0, config_1.default)('project')
            .where('status', 'completed')
            .andWhere('donor_id', userId)
            .count('id as count')
            .first()
        : yield (0, config_1.default)('project')
            .where('organization_id', orgId)
            .andWhere('status', 'completed')
            .count('id as count')
            .first();
    const activeProjectsCount = isDonor
        ? yield (0, config_1.default)('project')
            .where('status', 'active')
            .andWhere('donor_id', userId)
            .count('id as count')
            .first()
        : yield (0, config_1.default)('project')
            .where('organization_id', orgId)
            .andWhere('status', 'active')
            .count('id as count')
            .first();
    const totalDonations = isDonor
        ? yield (0, config_1.default)('donations')
            .where('donor_id', userId)
            .sum('amount as total')
            .first()
        : yield (0, config_1.default)('donations')
            .where('ngo_id', orgId)
            .sum('amount as total')
            .first();
    const walletBalance = yield (0, config_1.default)('wallet')
        .where('user_id', userId)
        .select('balance')
        .first();
    const formattedTotalDonations = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format((totalDonations === null || totalDonations === void 0 ? void 0 : totalDonations.total) || 0);
    const formattedWalletBalance = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format((walletBalance === null || walletBalance === void 0 ? void 0 : walletBalance.balance) || 0);
    return {
        completedProjectsCount: (completedProjectsCount === null || completedProjectsCount === void 0 ? void 0 : completedProjectsCount.count) || 0,
        activeProjectsCount: (activeProjectsCount === null || activeProjectsCount === void 0 ? void 0 : activeProjectsCount.count) || 0,
        totalDonations: formattedTotalDonations,
        walletBalance: formattedWalletBalance
    };
});
exports.getCounts = getCounts;
