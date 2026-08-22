export * from "./match";
export * from "./market";
export * from "./position";
export * from "./transaction";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  kind: "market" | "system" | "wallet";
}

export interface WalletState {
  address: string | null;
  connected: boolean;
  balance: number;
  chainName: string;
}

export interface PortfolioSummary {
  totalBalance: number;
  totalGain: number;
  activePositions: number;
  resolvedPositions: number;
  unrealizedPnL: number;
  realizedPnL: number;
}

export interface FaucetClaimResult {
  address: string;
  amount: string;
  txHash: string;
  message: string;
  nextClaimTime: string;
  timestamp: string;
}
