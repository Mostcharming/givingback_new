"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.production = exports.development = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './.env' });
const development = {
    client: 'mysql2',
    connection: {
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_DATABASE
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './src/config/migrations'
    }
};
exports.development = development;
const production = {
    client: 'mysql2',
    connection: {
        host: process.env.PROD_DB_HOST,
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_DATABASE
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './src/config/migrations'
    }
};
exports.production = production;
