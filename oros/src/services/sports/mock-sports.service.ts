import { SportsProvider, LiveFixture, MatchState, MatchEvent } from "./provider.interface.js";

/**
 * Mock sports service for development/testing
 * Returns deterministic golden script data
 */
export class MockSportsService implements SportsProvider {
  readonly name = "mock";

  private readonly GOLDEN_SCRIPT: MatchEvent[] = [
    {
      id: "mock-1",
      match_id: "mock-arsenal-barcelona",
      minute: 68,
      team: "Arsenal",
      type: "dangerous_attack",
      commentary: "Saka drives into the box and wins a corner.",
    },
    {
      id: "mock-2",
      match_id: "mock-arsenal-barcelona",
      minute: 72,
      team: "Arsenal",
      type: "dangerous_attack",
      commentary: "Arsenal are applying sustained pressure. Corner after corner.",
    },
    {
      id: "mock-3",
      match_id: "mock-arsenal-barcelona",
      minute: 74,
      team: "Arsenal",
      type: "shot_on_target",
      commentary: "SHOT ON TARGET! Arsenal strike the goal — what a save!",
    },
  ];

  async getLiveFixtures(): Promise<LiveFixture[]> {
    return [
      {
        id: "mock-arsenal-barcelona",
        home_team: "Arsenal",
        away_team: "Barcelona",
        status: "live",
        started_at: new Date(Date.now() - 68 * 60 * 1000).toISOString(),
      },
    ];
  }

  async getUpcomingFixtures(): Promise<LiveFixture[]> {
    return [
      {
        id: "mock-real-madrid-manchester",
        home_team: "Real Madrid",
        away_team: "Manchester City",
        status: "scheduled",
        started_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "mock-bayern-psg",
        home_team: "Bayern Munich",
        away_team: "Paris Saint-Germain",
        status: "scheduled",
        started_at: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  async getMatchState(matchId: string): Promise<MatchState | null> {
    if (matchId === "mock-arsenal-barcelona") {
      return {
        match_id: matchId,
        home_team: "Arsenal",
        away_team: "Barcelona",
        status: "live",
        minute: 68,
        home_score: 1,
        away_score: 1,
        started_at: new Date(Date.now() - 68 * 60 * 1000).toISOString(),
      };
    }
    return null;
  }

  async fetchNewEvents(matchId: string, sinceEventId?: string): Promise<MatchEvent[]> {
    if (matchId !== "mock-arsenal-barcelona") {
      return [];
    }

    // Return events after sinceEventId
    if (!sinceEventId) {
      return this.GOLDEN_SCRIPT;
    }

    const lastIndex = this.GOLDEN_SCRIPT.findIndex((e) => e.id === sinceEventId);
    if (lastIndex === -1) {
      return this.GOLDEN_SCRIPT;
    }

    return this.GOLDEN_SCRIPT.slice(lastIndex + 1);
  }
}
