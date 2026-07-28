"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const index_1 = __importDefault(require("./api/index"));
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err);
    process.exit(1);
});
(0, dotenv_1.config)();
const port = process.env.PORT || 5000;
const server = index_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(reason);
    server.close(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
