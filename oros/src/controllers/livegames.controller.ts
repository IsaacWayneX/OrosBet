import { Request, Response } from "express";
import { getSportsProvider } from "../services/sports/index.js";

const sportsProvider = getSportsProvider();

export const getLiveGames = async (req: Request, res: Response) => {
  try {
    const fixtures = await sportsProvider.getLiveFixtures();
    res.json({
      fixtures,
      count: fixtures.length,
      provider: sportsProvider.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[getLiveGames] Error:", error);
    res.status(500).json({ error: "Failed to fetch live games" });
  }
};

export const getUpcomingGames = async (req: Request, res: Response) => {
  try {
    const fixtures = await sportsProvider.getUpcomingFixtures();
    res.json({
      fixtures,
      count: fixtures.length,
      provider: sportsProvider.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[getUpcomingGames] Error:", error);
    res.status(500).json({ error: "Failed to fetch upcoming games" });
  }
};

export const getMatchDetails = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;

    // Fetch match state and events in parallel
    const [matchState, events] = await Promise.all([
      sportsProvider.getMatchState(matchId),
      sportsProvider.fetchNewEvents(matchId),
    ]);

    if (!matchState) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.json({
      match: matchState,
      events,
      provider: sportsProvider.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[getMatchDetails] Error:", error);
    res.status(500).json({ error: "Failed to fetch match details" });
  }
};

export const getLeagues = async (req: Request, res: Response) => {
  try {
    // TODO: Implement league fetching from Sportmonks
    // For now return mock data
    res.json({
      leagues: [
        { id: 8, name: "Premier League", country: "England" },
        { id: 82, name: "La Liga", country: "Spain" },
        { id: 109, name: "Serie A", country: "Italy" },
        { id: 2, name: "Champions League", country: "Europe" },
      ],
      count: 4,
      provider: sportsProvider.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[getLeagues] Error:", error);
    res.status(500).json({ error: "Failed to fetch leagues" });
  }
};

export const getFixturesByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const leaguesParam = req.query.leagues as string | undefined;

    // Parse leagues parameter (comma-separated IDs)
    const leagueIds = leaguesParam ? leaguesParam.split(",").map(Number) : [];

    res.json({
      date,
      leagues: leagueIds,
      fixtures: [],
      count: 0,
      provider: sportsProvider.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[getFixturesByDate] Error:", error);
    res.status(500).json({ error: "Failed to fetch fixtures by date" });
  }
};
