import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("chat_message", (table) => {
    table.increments("id").primary();

    // Reference to chat
    table
      .integer("chat_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("chat")
      .onDelete("CASCADE");

    // Sender information
    table
      .integer("sender_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .enum("sender_user_type", ["donor", "NGO", "admin", "corporate"])
      .notNullable();

    // Message content
    table.text("message").notNullable();

    // Attachment support
    table.json("attachments").nullable(); // JSON array of attachment objects

    // Message status
    table
      .enum("status", ["sent", "delivered", "read"])
      .defaultTo("sent")
      .notNullable();

    // Read receipt timestamp
    table.datetime("read_at").nullable();

    // Timestamps
    table.timestamps(true, true);

    // Indexes for efficient querying
    table.index("chat_id");
    table.index("sender_user_id");
    table.index("created_at");
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("chat_message");
};
