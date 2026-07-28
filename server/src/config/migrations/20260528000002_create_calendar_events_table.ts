import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("calendar_events", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("project_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("project")
      .onDelete("SET NULL");

    table.string("title", 255).notNullable();

    table.text("description").nullable();

    table.dateTime("start_time").notNullable();

    table.dateTime("end_time").notNullable();

    table
      .enum("event_type", [
        "project",
        "milestone",
        "meeting",
        "deadline",
        "other",
      ])
      .defaultTo("other");

    table.string("location", 255).nullable();

    table.json("attendees").nullable();

    table.timestamps(true, true);

    // Indexes for performance
    table.index("user_id");
    table.index("project_id");
    table.index("start_time");
    table.index(["user_id", "start_time"]);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("calendar_events");
};
