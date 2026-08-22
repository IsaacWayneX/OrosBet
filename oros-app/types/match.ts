export interface MatchEvent {
  id: string;
  minute: number;
  team: string;
  type: string;
  commentary: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  status: "scheduled" | "live" | "finished";
  startedAt?: string;
  homeScore: number;
  awayScore: number;
  minute?: number | null;
  league?: string;
  events?: MatchEvent[];
}
