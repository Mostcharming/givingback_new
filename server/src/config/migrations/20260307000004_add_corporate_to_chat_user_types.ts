import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  // Modify the enum columns to include 'corporate'
  await knex.schema.alterTable("chat", (table) => {
    table
      .enum("participant1_user_type", ["donor", "ngo", "admin", "corporate"])
      .notNullable()
      .alter();
    table
      .enum("participant2_user_type", ["donor", "ngo", "admin", "corporate"])
      .notNullable()
      .alter();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("chat", (table) => {
    table
      .enum("participant1_user_type", ["donor", "ngo", "admin"])
      .notNullable()
      .alter();
    table
      .enum("participant2_user_type", ["donor", "ngo", "admin"])
      .notNullable()
      .alter();
  });
};
