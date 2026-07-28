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
    yield knex.schema.createTable("chat", (table) => {
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
});
exports.up = up;
const down = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.dropTable("chat");
});
exports.down = down;
