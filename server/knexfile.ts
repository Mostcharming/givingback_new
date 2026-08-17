import { config as dotenvConfig } from 'dotenv'
import { Knex } from 'knex'

dotenvConfig({ path: './.env' })

const getNonNegativeInteger = (name: string, fallback: number): number => {
  const value = process.env[name]

  if (value === undefined || value.trim() === '') {
    return fallback
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

const poolMax = Math.max(1, getNonNegativeInteger('DB_POOL_MAX', 10))
const poolMin = Math.min(getNonNegativeInteger('DB_POOL_MIN', 0), poolMax)

const pool = {
  min: poolMin,
  max: poolMax,
  idleTimeoutMillis: getNonNegativeInteger('DB_POOL_IDLE_TIMEOUT_MS', 30000),
  reapIntervalMillis: getNonNegativeInteger('DB_POOL_REAP_INTERVAL_MS', 1000),
  createTimeoutMillis: getNonNegativeInteger('DB_POOL_CREATE_TIMEOUT_MS', 30000),
  destroyTimeoutMillis: getNonNegativeInteger('DB_POOL_DESTROY_TIMEOUT_MS', 5000)
}

const acquireConnectionTimeout = getNonNegativeInteger('DB_ACQUIRE_TIMEOUT_MS', 30000)

const development: Knex.Config = {
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
}

const production: Knex.Config = {
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
}

export { development, production }
