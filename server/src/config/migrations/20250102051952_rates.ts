import { Knex } from 'knex'

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('rates', (table) => {
    table.increments('id').primary().unsigned().notNullable()
    table.float('rate').notNullable()
    table.enu('mode', ['manual', 'automatic']).notNullable()
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now()) // Set default timestamp
  })

  await knex.raw(
    'ALTER TABLE rates MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  )
}

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('rates')
}
