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
exports.fetchRateFromGoogle = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const fetchRateFromGoogle = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('https://api.exchangerate-api.com/v4/latest/USD');
        const rate = response.data.rates.NGN;
        yield saveRateToDB(rate);
    }
    catch (error) {
        console.error('Error fetching rate from Google:', error);
    }
});
exports.fetchRateFromGoogle = fetchRateFromGoogle;
const saveRateToDB = (rate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestRate = yield (0, config_1.default)('rates').orderBy('updated_at', 'desc').first();
        if (latestRate && latestRate.mode !== 'automatic') {
            console.log('Last rate entry is not automatic. Skipping update.');
            return;
        }
        if (!latestRate || latestRate.mode === 'automatic') {
            yield (0, config_1.default)('rates').del();
            yield (0, config_1.default)('rates').insert({ rate, mode: 'automatic' });
            console.log('Rate updated automatically.');
        }
        console.log('Rate saved to DB successfully.');
    }
    catch (error) {
        console.error('Error saving rate to DB:', error);
    }
});
