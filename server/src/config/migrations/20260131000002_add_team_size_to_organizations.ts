import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.table("organizations", (table) => {
    table.integer("team_size").defaultTo(0).notNullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table("organizations", (table) => {
    table.dropColumn("team_size");
  });
};
