import express, { Express, Request, Response, NextFunction } from "express";
import { env } from "./config/env.js";

// Routes
import healthRoutes from "./routes/health.routes.js";
import liveGamesRoutes from "./routes/livegames.routes.js";
import marketsRoutes from "./routes/markets.routes.js";
import userRoutes from "./routes/user.routes.js";
import faucetRoutes from "./routes/faucet.routes.js";

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// Register routes
app.use("/api/v1", healthRoutes);
app.use("/api/v1", liveGamesRoutes);
app.use("/api/v1", marketsRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", faucetRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error("[ERROR]", err.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: env.nodeEnv === "development" ? err.message : "An error occurred",
    });
  }
);

export default app;
