import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  // Update sender_user_type enum to use lowercase 'ngo' instead of 'NGO'
  await knex.schema.alterTable("chat_message", (table) => {
    table
      .enum("sender_user_type", ["donor", "ngo", "admin", "corporate"])
      .notNullable()
      .alter();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("chat_message", (table) => {
    table
      .enum("sender_user_type", ["donor", "NGO", "admin", "corporate"])
      .notNullable()
      .alter();
  });
};
