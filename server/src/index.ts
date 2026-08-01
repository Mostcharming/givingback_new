import "dotenv/config";
import app from "./api/index";
import db from "./config";

process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  console.error(err);
  process.exit(1);
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

const closeServer = (exitCode: number, signal?: string) => {
  if (signal) {
    console.log(`${signal} received. Shutting down gracefully.`);
  }

  server.close(async (error) => {
    if (error) {
      console.error("Error while closing the HTTP server:", error);
    }

    await db.destroy();
    process.exit(error ? 1 : exitCode);
  });
};

process.on("unhandledRejection", (reason: any) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(reason);
  closeServer(1);
});

process.on("SIGTERM", () => closeServer(0, "SIGTERM"));
process.on("SIGINT", () => closeServer(0, "SIGINT"));
