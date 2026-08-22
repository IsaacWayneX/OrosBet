export interface Market {
  id: string;
  matchId: string;
  title: string;
  description: string;
  outcomeYesPrice: number;
  outcomeNoPrice: number;
  probabilityYes: number;
  probabilityNo: number;
  volume: number;
  liquidity: number;
  status: "open" | "resolved" | "closed";
  resolutionDeadline: string;
  result?: "yes" | "no";
}
