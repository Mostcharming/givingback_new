import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.table("milestone", (table) => {
    table.datetime("due_date").nullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table("milestone", (table) => {
    table.dropColumn("due_date");
  });
};
