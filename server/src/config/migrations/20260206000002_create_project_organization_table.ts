import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("project_organization", (table) => {
    table.increments("id").primary();

    table
      .integer("project_id")
      .unsigned() // <-- REQUIRED
      .notNullable()
      .references("id")
      .inTable("project")
      .onDelete("CASCADE");

    table
      .integer("organization_id")
      .unsigned() // <-- REQUIRED
      .notNullable()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");

    table.timestamps(true, true);

    table.unique(["project_id", "organization_id"]);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("project_organization");
};
