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
    yield knex.schema.createTable("chat_message", (table) => {
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
});
exports.up = up;
const down = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.dropTable("chat_message");
});
exports.down = down;
