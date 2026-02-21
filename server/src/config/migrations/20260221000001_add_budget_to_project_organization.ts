import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("project_organization", (table) => {
    table.decimal("budget", 15, 2).notNullable().defaultTo(0);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("project_organization", (table) => {
    table.dropColumn("budget");
  });
};
