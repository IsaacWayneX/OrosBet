/**
 * Abstract sports provider interface
 * Supports both real Sportmonks API and mock providers
 */

export interface LiveFixture {
  id: string;
  home_team: string;
  away_team: string;
  status: "scheduled" | "live" | "finished";
  started_at?: string;
}

export interface MatchState {
  match_id: string;
  home_team: string;
  away_team: string;
  status: "scheduled" | "live" | "finished";
  minute: number | null;
  home_score: number;
  away_score: number;
  started_at?: string;
}

export interface MatchEvent {
  id?: string;
  match_id: string;
  minute: number;
  team: string;
  type: string;
  description?: string;
  commentary?: string;
}

export interface SportsProvider {
  readonly name: string;
  getLiveFixtures(): Promise<LiveFixture[]>;
  getUpcomingFixtures(): Promise<LiveFixture[]>;
  getMatchState(matchId: string): Promise<MatchState | null>;
  fetchNewEvents(matchId: string, sinceEventId?: string): Promise<MatchEvent[]>;
}
