import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";

import routes from "../components/index";
import { notificationMiddleware } from "../middleware/notifications";

const app = express();

const configuredTrustProxy = process.env.TRUST_PROXY?.trim();

if (configuredTrustProxy) {
  const numericTrustProxy = Number(configuredTrustProxy);

  app.set(
    "trust proxy",
    /^\d+$/.test(configuredTrustProxy) && Number.isInteger(numericTrustProxy)
      ? numericTrustProxy
      : configuredTrustProxy,
  );
} else if (process.env.NODE_ENV === "production") {
  // Production normally reaches Express through Nginx on this same host.
  // Trust loopback so a client cannot forge its IP in X-Forwarded-For.
  app.set("trust proxy", "loopback");
}

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const whitelist: string[] = [
  "http://192.168.1.156:5173",
  "http://192.168.1.165:5173",
  "https://givebackng.org",
  "https://api.givebackng.org",
  "https://www.givebackng.org",
  "http://localhost:5173",
];

const isAllowedOrigin = (origin: string) =>
  whitelist.includes(origin) ||
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

const corsOptions: CorsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    } else if (!isAllowedOrigin(origin)) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, Access-Control-Allow-Origin, Origin, X-Requested-With, Accept",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

if (process.env.NODE_ENV === "production") {
  app.use("/rest", limiter);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(notificationMiddleware);

app.use("/rest/v1", routes);

app.all("*", (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.code || 500;
  res.status(status).json({ error: err.message });
});

export default app;
