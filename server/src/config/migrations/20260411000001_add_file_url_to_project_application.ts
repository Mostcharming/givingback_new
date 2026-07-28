import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("project_application", (table) => {
    table.string("file_url").nullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("project_application", (table) => {
    table.dropColumn("file_url");
  });
};
