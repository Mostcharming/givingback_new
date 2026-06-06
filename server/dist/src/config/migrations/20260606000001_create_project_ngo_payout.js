"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.createTable("project_ngo_payout", (table) => {
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
        table.unique(["project_id", "organization_id", "payout_type", "milestone_id"], "proj_ngo_payout_unique");
    });
});
exports.up = up;
const down = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.dropTable("project_ngo_payout");
});
exports.down = down;
