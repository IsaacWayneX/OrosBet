export interface Transaction {
  id: string;
  type: "buy" | "sell" | "claim" | "deposit" | "faucet";
  status: "pending" | "confirmed" | "failed";
  label: string;
  hash?: string;
  createdAt: string;
  amount?: number;
}
