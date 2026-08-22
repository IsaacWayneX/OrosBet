import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.port;

const server = app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("OROS BACKEND STARTING");
  console.log("=".repeat(60));
  console.log("");
  console.log("Environment: " + env.nodeEnv);
  console.log("Port: " + PORT);
  console.log("Server: http://localhost:" + PORT);
  console.log("Health: http://localhost:" + PORT + "/health");
  console.log("");
  console.log("RPC: " + env.monadRpcUrl);
  console.log("Database: " + (env.databaseUrl ? "Configured" : "Missing"));
  console.log("Supabase: " + (env.supabaseUrl ? "Configured" : "Missing"));
  console.log("");
  console.log("Ready to accept requests.");
  console.log("=".repeat(60));
});

// Graceful shutdown on SIGTERM
process.on("SIGTERM", () => {
  console.log("");
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Graceful shutdown on SIGINT
process.on("SIGINT", () => {
  console.log("");
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
