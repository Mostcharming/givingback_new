import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("notifications", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .enum("icon_type", ["deposit", "withdrawal", "info"])
      .notNullable();

    table.decimal("amount", 15, 2).notNullable();

    table.string("action", 100).notNullable();

    table.string("target", 100).notNullable();

    table.string("status", 50).notNullable();

    table.timestamps(true, true);

    // Indexes for performance
    table.index("user_id");
    table.index("created_at");
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("notifications");
};
