"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = require("../../knexfile");
const env = process.env.NODE_ENV || 'development';
const db = (0, knex_1.default)(env === 'production' ? knexfile_1.production : knexfile_1.development);
exports.default = db;