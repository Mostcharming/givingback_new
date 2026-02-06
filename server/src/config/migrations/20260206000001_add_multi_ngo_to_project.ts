import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.table("project", (table) => {
    table.boolean("multi_ngo").defaultTo(false).notNullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table("project", (table) => {
    table.dropColumn("multi_ngo");
  });
};
