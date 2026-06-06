import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("project_ngo_payout", (table) => {
    table.increments("id").primary();
    table.integer("project_id").unsigned().notNullable();
    table.integer("organization_id").unsigned().notNullable();
    table.integer("milestone_id").unsigned().nullable();
    table
      .enum("payout_type", ["mobilization", "milestone"])
      .notNullable();
    table.decimal("amount", 15, 2).notNullable().defaultTo(0);
    table.enum("status", ["paid"]).notNullable().defaultTo("paid");
    table.integer("paid_by_user_id").unsigned().nullable();
    table.datetime("paid_at").notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);

    table.foreign("project_id").references("id").inTable("project").onDelete("CASCADE");
    table
      .foreign("organization_id")
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");
    table.foreign("milestone_id").references("id").inTable("milestone").onDelete("CASCADE");
    table.foreign("paid_by_user_id").references("id").inTable("users").onDelete("SET NULL");

    table.unique(
      ["project_id", "organization_id", "payout_type", "milestone_id"],
      "proj_ngo_payout_unique"
    );
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("project_ngo_payout");
};
