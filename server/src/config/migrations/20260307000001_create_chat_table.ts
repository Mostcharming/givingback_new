import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("chat", (table) => {
    table.increments("id").primary();

    // First participant
    table
      .integer("participant1_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .enum("participant1_user_type", ["donor", "ngo", "admin"])
      .notNullable();

    // Second participant
    table
      .integer("participant2_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .enum("participant2_user_type", ["donor", "ngo", "admin"])
      .notNullable();

    // Unread message counts for each participant
    table.integer("participant1_unread_count").defaultTo(0).notNullable();
    table.integer("participant2_unread_count").defaultTo(0).notNullable();

    // Timestamps
    table.timestamps(true, true);

    // Composite unique index to prevent duplicate chats between same participants
    table.unique(["participant1_user_id", "participant2_user_id"]);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("chat");
};
