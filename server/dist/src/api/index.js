"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../components/index"));
const rateUtils_1 = require("../utils/rateUtils");
const app = (0, express_1.default)();
app.set("view engine", "pug");
app.set("views", path_1.default.join(__dirname, "views"));
app.enable("trust proxy");
const whitelist = [
    "http://192.168.1.187:5173",
    "https://givebackng.org",
    "https://api.givebackng.org",
    "https://www.givebackng.org",
    "http://localhost:5173",
];
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        else if (whitelist.indexOf(origin) === -1) {
            return callback(new Error("Not allowed by CORS"), false);
        }
        return callback(null, true);
    },
};
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Origin, X-Requested-With, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use((0, cors_1.default)(corsOptions));
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use("/rest/v1", index_1.default);
app.all("*", (err, req, res, next) => {
    const status = err.code || 500;
    res.status(status).json({ error: err.message });
});
// Fetch rate every 5 minutes using cron job
node_cron_1.default.schedule("*/5 * * * *", rateUtils_1.fetchRateFromGoogle);
exports.default = app;
