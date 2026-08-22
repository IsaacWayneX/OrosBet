/**
 * Abstract sports provider interface
 * Supports both real Sportmonks API and mock providers
 */

export interface LiveFixture {
  id: string;
  home_team: string;
  home_logo?: string;
  away_team: string;
  away_logo?: string;
  status: "scheduled" | "live" | "finished";
  started_at?: string;
  home_score?: number;
  away_score?: number;
  minute?: number | null;
}

export interface MatchState {
  match_id: string;
  home_team: string;
  home_logo?: string;
  away_team: string;
  away_logo?: string;
  status: "scheduled" | "live" | "finished";
  minute: number | null;
  home_score: number;
  away_score: number;
  started_at?: string;
  venue?: {
    name: string;
    city: string;
    capacity: number;
    surface: string;
    image_path?: string;
  };
  league?: {
    name: string;
    short_code?: string;
    image_path?: string;
  };
}

export interface MatchEvent {
  id?: string;
  match_id: string;
  minute: number;
  team: string;
  type: string;
  description?: string;
  commentary?: string;
  playerName?: string;
  playerImage?: string;
  result?: string;
}

export interface SportsProvider {
  readonly name: string;
  getLiveFixtures(): Promise<LiveFixture[]>;
  getUpcomingFixtures(): Promise<LiveFixture[]>;
  getMatchState(matchId: string): Promise<MatchState | null>;
  fetchNewEvents(matchId: string, sinceEventId?: string): Promise<MatchEvent[]>;
}
