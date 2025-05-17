import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cron from "node-cron";
import path from "path";

import { fetchRateFromGoogle } from "../utils/rateUtils";
import routes from "../components/index";

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.enable("trust proxy");

const whitelist: string[] = [
  "http://192.168.1.152:5173",
  "https://givebackng.org",
  "https://api.givebackng.org",
  "https://www.givebackng.org",
  "http://localhost:5173",
];

const corsOptions: CorsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    } else if (whitelist.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Origin, Origin, X-Requested-With, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use("/rest/v1", routes);

app.all("*", (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.code || 500;
  res.status(status).json({ error: err.message });
});

// Fetch rate every 5 minutes using cron job
cron.schedule("*/5 * * * *", fetchRateFromGoogle);

export default app;
