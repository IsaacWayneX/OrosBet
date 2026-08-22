import { blockchainService } from "../blockchain/blockchain.service.js";

/**
 * Market service for market creation and management
 * Orchestrates blockchain calls and database storage
 */

interface MarketData {
  description: string;
  outcomes: string[];
  resolutionDeadline: number;
  initialLiquidity: bigint;
}

interface Market {
  id: number;
  description: string;
  outcomes: string[];
  resolved: boolean;
  resolutionDeadline: number;
  createdAt: Date;
}

export class MarketService {
  private markets: Map<number, Market> = new Map();
  private nextMarketId = 1;

  async createMarket(data: MarketData) {
    try {
      console.log("[MarketService] Creating market:", data);

      const marketId = this.nextMarketId++;
      const market: Market = {
        id: marketId,
        description: data.description,
        outcomes: data.outcomes,
        resolved: false,
        resolutionDeadline: data.resolutionDeadline,
        createdAt: new Date(),
      };

      // Store in memory (TODO: replace with database)
      this.markets.set(marketId, market);

      // Call blockchain service to create on-chain
      // const txHash = await blockchainService.createMarket(
      //   data.description,
      //   data.outcomes,
      //   data.resolutionDeadline,
      //   data.initialLiquidity
      // );

      return {
        ...market,
        blockchainId: marketId, // Would be contract-assigned ID
      };
    } catch (error) {
      console.error("[MarketService] createMarket error:", error);
      throw error;
    }
  }

  async getMarket(marketId: number) {
    try {
      // Check in-memory store first
      if (this.markets.has(marketId)) {
        return this.markets.get(marketId);
      }

      // TODO: Fetch from database
      console.log("[MarketService] Fetching market:", { marketId });

      // Try blockchain
      const state = await blockchainService.getMarketState(marketId);
      if (state) {
        return {
          id: marketId,
          description: (state as any)[0],
          outcomes: (state as any)[1],
          resolved: (state as any)[2],
          resolutionDeadline: 0,
          createdAt: new Date(),
        };
      }

      return null;
    } catch (error) {
      console.error("[MarketService] getMarket error:", error);
      return null;
    }
  }

  async listMarkets(limit: number = 20, offset: number = 0) {
    try {
      console.log("[MarketService] Listing markets:", { limit, offset });

      // TODO: Fetch from database
      const allMarkets = Array.from(this.markets.values());
      const markets = allMarkets.slice(offset, offset + limit);

      return {
        markets,
        total: allMarkets.length,
      };
    } catch (error) {
      console.error("[MarketService] listMarkets error:", error);
      return { markets: [], total: 0 };
    }
  }

  async buyShares(
    marketId: number,
    outcomeId: number,
    amount: bigint,
    userAddress: string
  ) {
    try {
      console.log("[MarketService] Buying shares:", {
        marketId,
        outcomeId,
        amount,
        userAddress,
      });

      // TODO: Call blockchain service to buy shares
      // const txHash = await blockchainService.placeBet(marketId, outcomeId, amount);

      // TODO: Store transaction in database

      return {
        marketId,
        outcomeId,
        amount,
        userAddress,
        status: "pending",
      };
    } catch (error) {
      console.error("[MarketService] buyShares error:", error);
      throw error;
    }
  }

  async sellShares(
    marketId: number,
    outcomeId: number,
    shares: bigint,
    userAddress: string
  ) {
    try {
      console.log("[MarketService] Selling shares:", {
        marketId,
        outcomeId,
        shares,
        userAddress,
      });

      // TODO: Call blockchain service to sell shares
      // const txHash = await blockchainService.sellShares(marketId, outcomeId, shares);

      // TODO: Store transaction in database

      return {
        marketId,
        outcomeId,
        shares,
        userAddress,
        status: "pending",
      };
    } catch (error) {
      console.error("[MarketService] sellShares error:", error);
      throw error;
    }
  }

  async resolveMarket(marketId: number, correctOutcome: number) {
    try {
      console.log("[MarketService] Resolving market:", {
        marketId,
        correctOutcome,
      });

      const market = this.markets.get(marketId);
      if (market) {
        market.resolved = true;
      }

      // TODO: Call blockchain service
      // const txHash = await blockchainService.resolveMarket(marketId, correctOutcome);

      return {
        marketId,
        correctOutcome,
        status: "pending",
      };
    } catch (error) {
      console.error("[MarketService] resolveMarket error:", error);
      throw error;
    }
  }
}

export const marketService = new MarketService();
