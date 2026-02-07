import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.table("milestone_update", (table) => {
    table
      .integer("organization_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("organizations")
      .onDelete("SET NULL");
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table("milestone_update", (table) => {
    table.dropColumn("organization_id");
  });
};
