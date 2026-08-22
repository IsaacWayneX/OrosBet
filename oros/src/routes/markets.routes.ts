import { Router } from "express";
import {
  listMarkets,
  placeBet,
  createMarket,
  getMarket,
  resolveMarket,
} from "../controllers/markets.controller.js";

const router = Router();

// GET /api/v1/markets
// List all markets
router.get("/markets", listMarkets);

// POST /api/v1/markets/bet
// Place a bet on a market
router.post("/markets/bet", placeBet);

// POST /api/v1/markets
// Create a new market
router.post("/markets", createMarket);

// GET /api/v1/markets/:marketId
// Get market details
router.get("/markets/:marketId", getMarket);

// POST /api/v1/markets/:marketId/resolve
// Resolve a market with correct outcome
router.post("/markets/:marketId/resolve", resolveMarket);

export default router;
