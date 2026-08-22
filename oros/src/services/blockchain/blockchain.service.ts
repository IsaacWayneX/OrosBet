import { createPublicClient, createWalletClient, http, publicActions, walletActions } from "viem";
import { env } from "../../config/env.js";
import { OROS_TOKEN_ABI, OROS_MARKET_ABI } from "./abis.js";

/**
 * Blockchain service for Oros smart contract interactions
 * Uses Viem for contract calls on Monad testnet
 */
export class BlockchainService {
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: ReturnType<typeof createWalletClient>;

  constructor() {
    // Public client for reads
    this.publicClient = createPublicClient({
      transport: http(env.monadRpcUrl),
    });

    // Wallet client for writes (if private key available)
    this.walletClient = createWalletClient({
      transport: http(env.monadRpcUrl),
    }).extend(publicActions);
  }

  /**
   * Create a new prediction market
   */
  async createMarket(
    description: string,
    outcomes: string[],
    resolutionDeadline: number,
    initialLiquidity: bigint
  ) {
    try {
      if (!env.orosMarketAddress) {
        console.error("[BlockchainService] OROS_MARKET_ADDRESS not configured");
        return null;
      }

      console.log("[BlockchainService] Creating market:", {
        description,
        outcomes,
        resolutionDeadline,
        initialLiquidity: initialLiquidity.toString(),
      });

      // TODO: Implement actual contract call
      // This requires the deployer's private key and account setup
      // const hash = await this.walletClient.writeContract({
      //   address: env.orosMarketAddress as `0x${string}`,
      //   abi: OROS_MARKET_ABI,
      //   functionName: 'createMarket',
      //   args: [description, outcomes, resolutionDeadline, initialLiquidity],
      // });
      // return hash;

      return null;
    } catch (error) {
      console.error("[BlockchainService] createMarket error:", error);
      throw error;
    }
  }

  /**
   * Get market state from contract
   */
  async getMarketState(marketId: number) {
    try {
      if (!env.orosMarketAddress) {
        console.error("[BlockchainService] OROS_MARKET_ADDRESS not configured");
        return null;
      }

      const state = await this.publicClient.readContract({
        address: env.orosMarketAddress as `0x${string}`,
        abi: OROS_MARKET_ABI,
        functionName: "getMarketState",
        args: [BigInt(marketId)],
      });

      return state;
    } catch (error) {
      console.error("[BlockchainService] getMarketState error:", error);
      return null;
    }
  }

  /**
   * Place a bet on an outcome
   */
  async placeBet(marketId: number, outcomeId: number, amount: bigint) {
    try {
      if (!env.orosMarketAddress || !env.orosTokenAddress) {
        console.error("[BlockchainService] Contract addresses not configured");
        return null;
      }

      console.log("[BlockchainService] Placing bet:", {
        marketId,
        outcomeId,
        amount: amount.toString(),
      });

      // TODO: Implement actual contract call
      // 1. Approve token spending
      // 2. Buy shares

      return null;
    } catch (error) {
      console.error("[BlockchainService] placeBet error:", error);
      throw error;
    }
  }

  /**
   * Sell shares back to market
   */
  async sellShares(marketId: number, outcomeId: number, shares: bigint) {
    try {
      if (!env.orosMarketAddress) {
        console.error("[BlockchainService] OROS_MARKET_ADDRESS not configured");
        return null;
      }

      console.log("[BlockchainService] Selling shares:", {
        marketId,
        outcomeId,
        shares: shares.toString(),
      });

      // TODO: Implement actual contract call

      return null;
    } catch (error) {
      console.error("[BlockchainService] sellShares error:", error);
      throw error;
    }
  }

  /**
   * Resolve market with correct outcome
   */
  async resolveMarket(marketId: number, correctOutcome: number) {
    try {
      if (!env.orosMarketAddress || !env.resolverPrivateKey) {
        console.error("[BlockchainService] Missing configuration for market resolution");
        return null;
      }

      console.log("[BlockchainService] Resolving market:", {
        marketId,
        correctOutcome,
      });

      // TODO: Implement actual contract call with resolver account

      return null;
    } catch (error) {
      console.error("[BlockchainService] resolveMarket error:", error);
      throw error;
    }
  }

  /**
   * Claim winnings from resolved market
   */
  async claimWinnings(marketId: number) {
    try {
      if (!env.orosMarketAddress) {
        console.error("[BlockchainService] OROS_MARKET_ADDRESS not configured");
        return null;
      }

      console.log("[BlockchainService] Claiming winnings:", { marketId });

      // TODO: Implement actual contract call

      return null;
    } catch (error) {
      console.error("[BlockchainService] claimWinnings error:", error);
      throw error;
    }
  }

  /**
   * Get user's position in a market
   */
  async getUserPosition(userAddress: string, marketId: number) {
    try {
      if (!env.orosMarketAddress) {
        console.error("[BlockchainService] OROS_MARKET_ADDRESS not configured");
        return null;
      }

      const position = await this.publicClient.readContract({
        address: env.orosMarketAddress as `0x${string}`,
        abi: OROS_MARKET_ABI,
        functionName: "getUserPosition",
        args: [userAddress as `0x${string}`, BigInt(marketId)],
      });

      return position;
    } catch (error) {
      console.error("[BlockchainService] getUserPosition error:", error);
      return null;
    }
  }

  /**
   * Get outcome price for a market
   */
  async getOutcomePrice(marketId: number, outcomeId: number) {
    try {
      if (!env.orosMarketAddress) {
        console.error("[BlockchainService] OROS_MARKET_ADDRESS not configured");
        return null;
      }

      const price = await this.publicClient.readContract({
        address: env.orosMarketAddress as `0x${string}`,
        abi: OROS_MARKET_ABI,
        functionName: "getOutcomePrice",
        args: [BigInt(marketId), BigInt(outcomeId)],
      });

      return price;
    } catch (error) {
      console.error("[BlockchainService] getOutcomePrice error:", error);
      return null;
    }
  }

  /**
   * Get user token balance
   */
  async getTokenBalance(userAddress: string) {
    try {
      if (!env.orosTokenAddress) {
        console.error("[BlockchainService] OROS_TOKEN_ADDRESS not configured");
        return null;
      }

      const balance = await this.publicClient.readContract({
        address: env.orosTokenAddress as `0x${string}`,
        abi: OROS_TOKEN_ABI,
        functionName: "balanceOf",
        args: [userAddress as `0x${string}`],
      });

      return balance;
    } catch (error) {
      console.error("[BlockchainService] getTokenBalance error:", error);
      return null;
    }
  }
}

export const blockchainService = new BlockchainService();
