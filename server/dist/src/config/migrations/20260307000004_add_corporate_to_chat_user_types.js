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
    // Modify the enum columns to include 'corporate'
    yield knex.schema.alterTable("chat", (table) => {
        table
            .enum("participant1_user_type", ["donor", "ngo", "admin", "corporate"])
            .notNullable()
            .alter();
        table
            .enum("participant2_user_type", ["donor", "ngo", "admin", "corporate"])
            .notNullable()
            .alter();
    });
});
exports.up = up;
const down = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.alterTable("chat", (table) => {
        table
            .enum("participant1_user_type", ["donor", "ngo", "admin"])
            .notNullable()
            .alter();
        table
            .enum("participant2_user_type", ["donor", "ngo", "admin"])
            .notNullable()
            .alter();
    });
});
exports.down = down;
