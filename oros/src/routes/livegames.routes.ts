import { Router } from "express";
import {
  getLiveGames,
  getUpcomingGames,
  getMatchDetails,
  getLeagues,
  getFixturesByDate,
} from "../controllers/livegames.controller.js";

const router = Router();

// GET /api/v1/livegames
// Fetch live games from sports provider
router.get("/livegames", getLiveGames);

// GET /api/v1/livegames/upcoming
// Fetch upcoming games
router.get("/livegames/upcoming", getUpcomingGames);

// GET /api/v1/livegames/:matchId
// Fetch specific match details + events
router.get("/livegames/:matchId", getMatchDetails);

// GET /api/v1/fixtures-by-league/leagues
// Fetch available leagues
router.get("/fixtures-by-league/leagues", getLeagues);

// GET /api/v1/fixtures-by-league/date/:date
// Fetch fixtures for specific date and leagues
router.get("/fixtures-by-league/date/:date", getFixturesByDate);

export default router;
