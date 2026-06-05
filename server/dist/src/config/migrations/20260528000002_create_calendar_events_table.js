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
    yield knex.schema.createTable("calendar_events", (table) => {
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
});
exports.up = up;
const down = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.dropTable("calendar_events");
});
exports.down = down;
