export interface MatchEvent {
  id: string;
  minute: number;
  team: string;
  type: string;
  commentary: string;
  playerName?: string;
  playerImage?: string;
  result?: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  homeLogo?: string;
  awayTeam: string;
  awayLogo?: string;
  status: "scheduled" | "live" | "finished";
  startedAt?: string;
  homeScore: number;
  awayScore: number;
  minute?: number | null;
  league?: string;
  leagueDetail?: {
    name: string;
    shortCode?: string;
    imagePath?: string;
  };
  venue?: {
    name: string;
    city: string;
    capacity: number;
    surface: string;
    imagePath?: string;
  };
  events?: MatchEvent[];
}
