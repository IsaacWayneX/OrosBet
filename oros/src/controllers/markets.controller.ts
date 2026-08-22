import { Request, Response } from "express";
import { marketService } from "../services/markets/market.service.js";
import { blockchainService } from "../services/blockchain/blockchain.service.js";

export const listMarkets = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await marketService.listMarkets(limit, offset);

    res.json({
      markets: result.markets,
      total: result.total,
      limit,
      offset,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[listMarkets] Error:", error);
    res.status(500).json({ error: "Failed to fetch markets" });
  }
};

export const placeBet = async (req: Request, res: Response) => {
  try {
    const { marketId, outcomeId, amount, userAddress } = req.body;

    // Validate inputs
    if (!marketId || outcomeId === undefined || !amount || !userAddress) {
      return res.status(400).json({
        error: "Missing required fields: marketId, outcomeId, amount, userAddress",
      });
    }

    if (outcomeId !== 0 && outcomeId !== 1) {
      return res.status(400).json({ error: "outcomeId must be 0 or 1" });
    }

    if (isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    // Place bet via blockchain
    const txHash = await blockchainService.placeBet(
      parseInt(marketId),
      outcomeId,
      amount,
      userAddress
    );

    res.json({
      success: true,
      marketId,
      outcomeId,
      amount,
      userAddress,
      txHash,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[placeBet] Error:", error);
    res.status(500).json({ error: "Failed to place bet" });
  }
};

export const createMarket = async (req: Request, res: Response) => {
  try {
    const { description, outcomes, resolutionDeadline, initialLiquidity } = req.body;

    // Validate inputs
    if (!description || !outcomes || !resolutionDeadline) {
      return res.status(400).json({
        error: "Missing required fields: description, outcomes, resolutionDeadline",
      });
    }

    if (!Array.isArray(outcomes) || outcomes.length !== 2) {
      return res.status(400).json({ error: "Only binary outcomes supported" });
    }

    if (resolutionDeadline <= Date.now()) {
      return res.status(400).json({ error: "Resolution deadline must be in the future" });
    }

    // Create market
    const market = await marketService.createMarket({
      description,
      outcomes,
      resolutionDeadline,
      initialLiquidity: BigInt(initialLiquidity || 1000 * 10 ** 18),
    });

    res.status(201).json({
      market,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[createMarket] Error:", error);
    res.status(500).json({ error: "Failed to create market" });
  }
};

export const getMarket = async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;
    const market = await marketService.getMarket(parseInt(marketId));

    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }

    res.json({
      market,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[getMarket] Error:", error);
    res.status(500).json({ error: "Failed to fetch market details" });
  }
};

export const resolveMarket = async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;
    const { correctOutcome } = req.body;

    if (correctOutcome === undefined) {
      return res.status(400).json({ error: "correctOutcome is required" });
    }

    if (correctOutcome !== 0 && correctOutcome !== 1) {
      return res.status(400).json({ error: "correctOutcome must be 0 or 1" });
    }

    // Resolve via blockchain
    const txHash = await blockchainService.resolveMarket(
      parseInt(marketId),
      correctOutcome
    );

    res.json({
      market: {
        id: marketId,
        resolved: true,
        correctOutcome,
      },
      txHash,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[resolveMarket] Error:", error);
    res.status(500).json({ error: "Failed to resolve market" });
  }
};
