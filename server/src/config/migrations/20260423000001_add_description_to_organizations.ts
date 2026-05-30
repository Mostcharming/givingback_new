import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("organizations", (table) => {
    table.text("description").nullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("organizations", (table) => {
    table.dropColumn("description");
  });
};
