import { createPublicClient, createWalletClient, http, publicActions, walletActions, privateKeyToAccount } from "viem";
import { env } from "../../config/env.js";
import { OROS_TOKEN_ABI, OROS_MARKET_ABI } from "./abis.js";

/**
 * Blockchain service for Oros smart contract interactions
 * Uses Viem for contract calls on Monad testnet
 */
export class BlockchainService {
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: ReturnType<typeof createWalletClient>;
  private account: ReturnType<typeof privateKeyToAccount> | null = null;

  constructor() {
    // Public client for reads
    this.publicClient = createPublicClient({
      transport: http(env.monadRpcUrl),
    });

    // Wallet client for writes
    this.walletClient = createWalletClient({
      transport: http(env.monadRpcUrl),
    }).extend(publicActions);

    // Initialize resolver account if private key is available
    if (env.resolverPrivateKey) {
      this.account = privateKeyToAccount(env.resolverPrivateKey as `0x${string}`);
    }
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
  async placeBet(marketId: number, outcomeId: number, amount: string, userAddress: string) {
    try {
      if (!env.orosMarketAddress || !env.orosTokenAddress || !this.account) {
        console.error("[BlockchainService] Missing configuration for betting");
        return null;
      }

      const amountBigInt = BigInt(amount);

      console.log("[BlockchainService] Placing bet:", {
        marketId,
        outcomeId,
        amount: amount,
        userAddress,
      });

      // Step 1: Approve token spending
      console.log("[BlockchainService] Approving token spending...");
      const approveTx = await this.walletClient.writeContract({
        account: this.account,
        address: env.orosTokenAddress as `0x${string}`,
        abi: OROS_TOKEN_ABI,
        functionName: "approve",
        args: [env.orosMarketAddress as `0x${string}`, amountBigInt],
      });

      console.log("[BlockchainService] Approve tx:", approveTx);

      // Step 2: Buy shares (place bet)
      console.log("[BlockchainService] Buying shares...");
      const buyTx = await this.walletClient.writeContract({
        account: this.account,
        address: env.orosMarketAddress as `0x${string}`,
        abi: OROS_MARKET_ABI,
        functionName: "buyShares",
        args: [BigInt(marketId), BigInt(outcomeId), amountBigInt],
      });

      console.log("[BlockchainService] Buy shares tx:", buyTx);

      return buyTx;
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
      if (!env.orosMarketAddress || !this.account) {
        console.error("[BlockchainService] OROS_MARKET_ADDRESS not configured");
        return null;
      }

      console.log("[BlockchainService] Selling shares:", {
        marketId,
        outcomeId,
        shares: shares.toString(),
      });

      const tx = await this.walletClient.writeContract({
        account: this.account,
        address: env.orosMarketAddress as `0x${string}`,
        abi: OROS_MARKET_ABI,
        functionName: "sellShares",
        args: [BigInt(marketId), BigInt(outcomeId), shares],
      });

      return tx;
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
      if (!env.orosMarketAddress || !this.account) {
        console.error("[BlockchainService] Missing configuration for market resolution");
        return null;
      }

      console.log("[BlockchainService] Resolving market:", {
        marketId,
        correctOutcome,
      });

      const tx = await this.walletClient.writeContract({
        account: this.account,
        address: env.orosMarketAddress as `0x${string}`,
        abi: OROS_MARKET_ABI,
        functionName: "resolveMarket",
        args: [BigInt(marketId), BigInt(correctOutcome)],
      });

      return tx;
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
      if (!env.orosMarketAddress || !this.account) {
        console.error("[BlockchainService] OROS_MARKET_ADDRESS not configured");
        return null;
      }

      console.log("[BlockchainService] Claiming winnings:", { marketId });

      const tx = await this.walletClient.writeContract({
        account: this.account,
        address: env.orosMarketAddress as `0x${string}`,
        abi: OROS_MARKET_ABI,
        functionName: "claimWinnings",
        args: [BigInt(marketId)],
      });

      return tx;
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
