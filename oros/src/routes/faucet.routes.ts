import { Router } from "express";
import { claimFaucet } from "../controllers/faucet.controller.js";

const router = Router();

// POST /api/v1/faucet/claim
// Claim OUSD tokens from faucet
router.post("/faucet/claim", claimFaucet);

export default router;
