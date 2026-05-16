import { config as dotenvConfig } from 'dotenv'
import { Knex } from 'knex'

dotenvConfig({ path: './.env' })

const development: Knex.Config = {
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
}

const production: Knex.Config = {
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
}

export { development, production }
