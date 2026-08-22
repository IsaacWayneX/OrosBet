import axios, { AxiosInstance } from "axios";
import { env } from "../../config/env.js";
import { SportsProvider, LiveFixture, MatchState, MatchEvent } from "./provider.interface.js";

/**
 * Sportmonks v3 API implementation
 * Fetches live football fixtures, match state, and events
 */
export class SportmonksService implements SportsProvider {
  readonly name = "sportmonks";
  private client: AxiosInstance;
  private lastEventIds: Map<string, number> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.sportmonks.com/v3/football",
      timeout: 10000,
    });
  }

  private async fetchJson<T>(path: string): Promise<T> {
    try {
      const url = `${path}?api_token=${env.sportsApiKey}&include=participants;scores;state`;
      const response = await this.client.get<{ data: T }>(url);
      return response.data.data;
    } catch (error) {
      console.error(`[SportmonksService] Error fetching ${path}:`, error);
      throw error;
    }
  }

  async getLiveFixtures(): Promise<LiveFixture[]> {
    try {
      if (!env.sportsApiKey) {
        console.warn("[SportmonksService] SPORTS_API_KEY not configured, returning empty");
        return [];
      }

      const fixtures = await this.fetchJson<any[]>("/livescores/inplay");
      return fixtures.map((fixture) => this.transformFixture(fixture));
    } catch (error) {
      console.error("[SportmonksService] getLiveFixtures failed:", error);
      return [];
    }
  }

  async getUpcomingFixtures(): Promise<LiveFixture[]> {
    try {
      if (!env.sportsApiKey) {
        return [];
      }

      const today = new Date();
      const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const startStr = today.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];

      const fixtures = await this.fetchJson<any[]>(
        `/fixtures/between/${startStr}/${endStr}`
      );

      return fixtures
        .filter((f) => f.state_id === 1) // Only unstarted
        .map((fixture) => this.transformFixture(fixture));
    } catch (error) {
      console.error("[SportmonksService] getUpcomingFixtures failed:", error);
      return [];
    }
  }

  async getMatchState(matchId: string): Promise<MatchState | null> {
    try {
      if (!env.sportsApiKey) {
        return null;
      }

      const fixture = await this.fetchJson<any>(`/fixtures/${matchId}`);
      return this.transformMatchState(fixture);
    } catch (error) {
      console.error("[SportmonksService] getMatchState failed:", error);
      return null;
    }
  }

  async fetchNewEvents(matchId: string, sinceEventId?: string): Promise<MatchEvent[]> {
    try {
      if (!env.sportsApiKey) {
        return [];
      }

      const events = await this.fetchJson<any[]>(`/fixtures/${matchId}/events`);

      // Track last event ID for deduplication
      const lastId = this.lastEventIds.get(matchId) || 0;
      const newEvents = events.filter((e) => !sinceEventId || parseInt(e.id) > parseInt(sinceEventId));

      if (newEvents.length > 0) {
        const maxId = Math.max(...newEvents.map((e) => parseInt(e.id)));
        this.lastEventIds.set(matchId, maxId);
      }

      return newEvents.map((event) => this.transformEvent(event, matchId));
    } catch (error) {
      console.error("[SportmonksService] fetchNewEvents failed:", error);
      return [];
    }
  }

  private transformFixture(fixture: any): LiveFixture {
    const participants = fixture.participants || [];
    const homeParticipant = participants.find((p: any) => p.meta?.location === "home");
    const awayParticipant = participants.find((p: any) => p.meta?.location === "away");
    
    const homeTeam = homeParticipant?.name || "Home";
    const awayTeam = awayParticipant?.name || "Away";
    const homeLogo = homeParticipant?.image_path || undefined;
    const awayLogo = awayParticipant?.image_path || undefined;

    return {
      id: String(fixture.id),
      home_team: homeTeam,
      home_logo: homeLogo,
      away_team: awayTeam,
      away_logo: awayLogo,
      status: this.getStatusFromState(fixture.state_id),
      started_at: fixture.starting_at,
    };
  }

  private transformMatchState(fixture: any): MatchState {
    const participants = fixture.participants || [];
    const homeParticipant = participants.find((p: any) => p.meta?.location === "home");
    const awayParticipant = participants.find((p: any) => p.meta?.location === "away");
    
    const homeTeam = homeParticipant?.name || "Home";
    const awayTeam = awayParticipant?.name || "Away";
    const homeLogo = homeParticipant?.image_path || undefined;
    const awayLogo = awayParticipant?.image_path || undefined;

    const scores = fixture.scores || [];
    const homeScore = scores.find((s: any) => s.description === "home")?.score || 0;
    const awayScore = scores.find((s: any) => s.description === "away")?.score || 0;

    return {
      match_id: String(fixture.id),
      home_team: homeTeam,
      home_logo: homeLogo,
      away_team: awayTeam,
      away_logo: awayLogo,
      status: this.getStatusFromState(fixture.state_id),
      minute: this.getMinuteFromState(fixture.state_id),
      home_score: homeScore,
      away_score: awayScore,
      started_at: fixture.starting_at,
    };
  }

  private transformEvent(event: any, matchId: string): MatchEvent {
    const typeMap: Record<string, string> = {
      goal: "goal",
      card: "card",
      substitution: "substitution",
      corner: "corner",
      injury_clearance: "injury_clearance",
      tackle: "tackle",
      interception: "interception",
      turnover: "turnover",
      foul_committed: "foul_committed",
      clearance: "clearance",
      chance_missed: "chance_missed",
      ball_recovery: "ball_recovery",
      dispossessed: "dispossessed",
      error: "error",
      keeper_pick_up: "keeper_pick_up",
      cross_not_claimed: "cross_not_claimed",
      smother: "smother",
      offside_provoked: "offside_provoked",
      shield_ball_opp: "shield_ball_opp",
      foul_throw_in: "foul_throw_in",
      penalty_faced: "penalty_faced",
      keeper_sweeper: "keeper_sweeper",
      chance_created: "chance_created",
      punch: "punch",
      good_skill: "good_skill",
      deleted_event: "deleted_event",
      aerial: "aerial",
      challenge: "challenge",
    };

    return {
      id: String(event.id),
      match_id: matchId,
      minute: event.minute || 0,
      team: event.team?.name || "Unknown",
      type: typeMap[event.type] || event.type,
      description: event.type,
      commentary: `${event.player?.name || "Event"}: ${event.type}`,
    };
  }

  private getStatusFromState(stateId: number): "scheduled" | "live" | "finished" {
    if (stateId === 1) return "scheduled";
    if (stateId === 2 || stateId === 3 || stateId === 4) return "live";
    return "finished";
  }

  private getMinuteFromState(stateId: number): number | null {
    // Would need actual minute from fixture data
    // For now, estimate based on state
    if (stateId === 1) return null; // Not started
    if (stateId === 2) return 45; // First half estimate
    if (stateId === 3) return 45; // Half-time
    if (stateId === 4) return 90; // Second half estimate
    return null;
  }
}
