import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("chat", (table) => {
    table.integer("participant1_user_id").unsigned().nullable().alter();
    table.integer("participant2_user_id").unsigned().nullable().alter();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("chat", (table) => {
    table.integer("participant1_user_id").unsigned().notNullable().alter();
    table.integer("participant2_user_id").unsigned().notNullable().alter();
  });
};
