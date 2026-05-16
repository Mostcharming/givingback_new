import knex from 'knex'
import { development, production } from '../../knexfile'

const env = process.env.NODE_ENV || 'development'

const db = knex(env === 'production' ? production : development)

export default db
