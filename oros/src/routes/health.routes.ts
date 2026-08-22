import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "oros-backend",
  });
});

export default router;
