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
    yield knex.schema.createTable("project_organization", (table) => {
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
});
exports.up = up;
const down = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.dropTable("project_organization");
});
exports.down = down;
