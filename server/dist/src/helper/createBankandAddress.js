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
exports.updateBank = exports.createBank = exports.createAddress = void 0;
const config_1 = __importDefault(require("../config"));
const createAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to access this resource.'
            });
        }
        const { state, city_lga, address } = req.body;
        const missingFields = [];
        if (!state)
            missingFields.push('state');
        if (!city_lga)
            missingFields.push('city_lga');
        if (!address)
            missingFields.push('address');
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: 'fail',
                message: `Missing required field(s): ${missingFields.join(', ')}`
            });
        }
        const newAddress = {
            state,
            city_lga,
            address,
            user_id: userId
        };
        yield (0, config_1.default)('address').insert(newAddress);
        next();
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong.',
            error: error.message
        });
    }
});
exports.createAddress = createAddress;
const createBank = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to access this resource.'
            });
        }
        const { bankName, accountName, accountNumber } = req.body;
        const missingFields = [];
        if (!bankName)
            missingFields.push('bankName');
        if (!accountName)
            missingFields.push('accountName');
        if (!accountNumber)
            missingFields.push('accountNumber');
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: 'fail',
                message: `Missing required field(s): ${missingFields.join(', ')}`
            });
        }
        const newBank = {
            bankName,
            accountName,
            accountNumber,
            user_id: userId
        };
        yield (0, config_1.default)('banks').insert(newBank);
        next();
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong.',
            error: error.message
        });
    }
});
exports.createBank = createBank;
const updateBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to access this resource.'
            });
        }
        const { bankName, accountName, accountNumber } = req.body;
        const updatedBank = {
            bankName,
            accountName,
            accountNumber
        };
        yield (0, config_1.default)('banks').where('user_id', userId).update(updatedBank);
        res.status(200).json({
            status: 'success',
            message: 'Banking details updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong.',
            error: error.message
        });
    }
});
exports.updateBank = updateBank;
