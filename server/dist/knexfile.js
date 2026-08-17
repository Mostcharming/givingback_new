"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.production = exports.development = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './.env' });
const getNonNegativeInteger = (name, fallback) => {
    const value = process.env[name];
    if (value === undefined || value.trim() === '') {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};
const poolMax = Math.max(1, getNonNegativeInteger('DB_POOL_MAX', 10));
const poolMin = Math.min(getNonNegativeInteger('DB_POOL_MIN', 0), poolMax);
const pool = {
    min: poolMin,
    max: poolMax,
    idleTimeoutMillis: getNonNegativeInteger('DB_POOL_IDLE_TIMEOUT_MS', 30000),
    reapIntervalMillis: getNonNegativeInteger('DB_POOL_REAP_INTERVAL_MS', 1000),
    createTimeoutMillis: getNonNegativeInteger('DB_POOL_CREATE_TIMEOUT_MS', 30000),
    destroyTimeoutMillis: getNonNegativeInteger('DB_POOL_DESTROY_TIMEOUT_MS', 5000)
};
const acquireConnectionTimeout = getNonNegativeInteger('DB_ACQUIRE_TIMEOUT_MS', 30000);
const development = {
    client: 'mysql2',
    connection: {
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_DATABASE,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    },
    pool,
    acquireConnectionTimeout,
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
        database: process.env.PROD_DB_DATABASE,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    },
    pool,
    acquireConnectionTimeout,
    migrations: {
        tableName: 'knex_migrations',
        directory: './src/config/migrations'
    }
};
exports.production = production;
