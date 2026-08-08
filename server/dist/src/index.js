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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const index_1 = __importDefault(require("./api/index"));
const config_1 = __importDefault(require("./config"));
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    console.error(err);
    process.exit(1);
});
const port = process.env.PORT || 5000;
const server = index_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
const closeServer = (exitCode, signal) => {
    if (signal) {
        console.log(`${signal} received. Shutting down gracefully.`);
    }
    server.close((error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error("Error while closing the HTTP server:", error);
        }
        yield config_1.default.destroy();
        process.exit(error ? 1 : exitCode);
    }));
};
process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(reason);
    closeServer(1);
});
process.on("SIGTERM", () => closeServer(0, "SIGTERM"));
process.on("SIGINT", () => closeServer(0, "SIGINT"));
