import { Router } from "express";
import {
  getCurrentUser,
  getUserPositions,
  getPortfolio,
} from "../controllers/user.controller.js";

const router = Router();

// GET /api/v1/user/me
// Get current user info
// TODO: Add auth middleware to verify JWT
router.get("/user/me", getCurrentUser);

// GET /api/v1/user/positions
// Get user's active positions
// TODO: Add auth middleware
router.get("/user/positions", getUserPositions);

// GET /api/v1/user/portfolio
// Get user's portfolio summary
// TODO: Add auth middleware
router.get("/user/portfolio", getPortfolio);

export default router;
