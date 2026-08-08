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
exports.getUsdToNgnRate = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";
const RATE_API_TIMEOUT_MS = 5000;
/**
 * Resolve the USD to NGN rate only when a conversion needs it.
 *
 * A manually configured rate remains authoritative. In automatic mode, the
 * live rate is fetched directly and is not persisted, so starting the server
 * no longer creates background API or database traffic.
 */
const getUsdToNgnRate = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const configuredRate = yield (0, config_1.default)("rates")
        .orderBy("updated_at", "desc")
        .first();
    if (configuredRate && configuredRate.mode !== "automatic") {
        const manualRate = Number(configuredRate.rate);
        if (!Number.isFinite(manualRate) || manualRate <= 0) {
            throw new Error("The manually configured USD to NGN rate is invalid.");
        }
        return manualRate;
    }
    const response = yield axios_1.default.get(RATE_API_URL, {
        timeout: RATE_API_TIMEOUT_MS,
    });
    const liveRate = Number((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.rates) === null || _b === void 0 ? void 0 : _b.NGN);
    if (!Number.isFinite(liveRate) || liveRate <= 0) {
        throw new Error("The exchange-rate provider returned an invalid NGN rate.");
    }
    return liveRate;
});
exports.getUsdToNgnRate = getUsdToNgnRate;
