export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  side: "yes" | "no";
  amount: number;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  status: "active" | "won" | "lost" | "claimed";
}
