import { Request, Response } from "express";
import { blockchainService } from "../services/blockchain/blockchain.service.js";

const FAUCET_AMOUNT = BigInt("100000000000000000");
const FAUCET_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const userClaimTimes: Map<string, number> = new Map();

export const claimFaucet = async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    // Validate address
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    // Check cooldown
    const lastClaimTime = userClaimTimes.get(address);
    if (lastClaimTime && Date.now() - lastClaimTime < FAUCET_COOLDOWN_MS) {
      const remainingMs = FAUCET_COOLDOWN_MS - (Date.now() - lastClaimTime);
      const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
      return res.status(429).json({
        error: "Faucet cooldown active. Try again in " + remainingHours + " hours",
        remainingSeconds: Math.ceil(remainingMs / 1000),
      });
    }

    // TODO: Call contract mint function via blockchain service
    // const txHash = await blockchainService.mintToken(address, FAUCET_AMOUNT);

    // Update cooldown
    userClaimTimes.set(address, Date.now());

    res.json({
      address,
      amount: FAUCET_AMOUNT.toString(),
      txHash: "0x",
      message: "100 OUSD claimed successfully",
      nextClaimTime: new Date(Date.now() + FAUCET_COOLDOWN_MS).toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[claimFaucet] Error:", error);
    res.status(500).json({ error: "Failed to claim from faucet" });
  }
};
