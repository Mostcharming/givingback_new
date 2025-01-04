"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const knex_1 = __importDefault(require("knex"));
(0, dotenv_1.config)();
const config = {
    development: {
        client: 'mysql',
        connection: {
            host: process.env.DEV_DB_HOST,
            user: process.env.DEV_DB_USER,
            password: process.env.DEV_DB_PASSWORD,
            database: process.env.DEV_DB_NAME
        }
    },
    production: {
        client: 'mysql',
        connection: {
            host: process.env.PROD_DB_HOST,
            user: process.env.PROD_DB_USER,
            password: process.env.PROD_DB_PASSWORD,
            database: process.env.PROD_DB_NAME
        }
    }
};
const env = process.env.NODE_ENV || 'development';
const db = (0, knex_1.default)(config[env]);
exports.default = db;
