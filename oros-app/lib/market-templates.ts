import type { Match } from "@/types";

export interface MarketTemplate {
  id: string;
  title: (homeTeam: string, awayTeam: string) => string;
  description: (homeTeam: string, awayTeam: string) => string;
}

/**
 * 8 rotating real-time action markets for live matches
 * Each market lasts 30s, 15s, or 10s randomly
 * When one expires, it's replaced with a new market
 */
export const LIVE_ACTION_MARKETS: MarketTemplate[] = [
  {
    id: "next-goal",
    title: (home, away) => `Who will score next?`,
    description: (home, away) => `Will ${home} or ${away} score the next goal?`,
  },
  {
    id: "corner-next",
    title: (home, away) => `Next team to take a corner?`,
    description: (home, away) => `Will ${home} or ${away} be awarded the next corner kick?`,
  },
  {
    id: "yellow-card",
    title: (home, away) => `Next yellow card?`,
    description: (home, away) => `Will the next yellow card be for ${home} or ${away}?`,
  },
  {
    id: "possession",
    title: (home, away) => `Will possession favor ${home}?`,
    description: (home, away) => `Will ${home} have more possession in the next 5 minutes?`,
  },
  {
    id: "shots",
    title: (home, away) => `Next shot on target?`,
    description: (home, away) => `Will the next shot on target be from ${home} or ${away}?`,
  },
  {
    id: "offsides",
    title: (home, away) => `Next offside call?`,
    description: (home, away) => `Will the next offside be against ${home} or ${away}?`,
  },
  {
    id: "foul",
    title: (home, away) => `Next foul committed by?`,
    description: (home, away) => `Will the next foul be committed by ${home} or ${away}?`,
  },
  {
    id: "throw-in",
    title: (home, away) => `Next throw-in for?`,
    description: (home, away) => `Will ${home} or ${away} take the next throw-in?`,
  },
];

// Random durations: 30s, 15s, or 10s
const DURATIONS = [30000, 15000, 10000]; // milliseconds

function getRandomDuration(): number {
  return DURATIONS[Math.floor(Math.random() * DURATIONS.length)];
}

export function generateLiveMarket(
  match: Match,
  seed: number
): any | null {
  if (match.status !== "live") {
    return null;
  }

  const template = LIVE_ACTION_MARKETS[seed % LIVE_ACTION_MARKETS.length];
  const duration = getRandomDuration();
  const expiresAt = Date.now() + duration;

  return {
    id: `live-${match.id}-${template.id}-${seed}-${Date.now()}`,
    matchId: match.id,
    title: template.title(match.homeTeam, match.awayTeam),
    description: template.description(match.homeTeam, match.awayTeam),
    outcomeYesPrice: 0.5 + (Math.random() - 0.5) * 0.3,
    outcomeNoPrice: 0.5 - (Math.random() - 0.5) * 0.3,
    probabilityYes: Math.round(50 + (Math.random() - 0.5) * 30),
    probabilityNo: Math.round(50 - (Math.random() - 0.5) * 30),
    volume: Math.floor(Math.random() * 50000) + 5000,
    liquidity: Math.floor(Math.random() * 100000) + 50000,
    status: "open" as const,
    resolutionDeadline: new Date(expiresAt).toISOString(),
    expiresAt,
    durationSeconds: duration / 1000,
  };
}

export function generateLiveMarkets(match: Match): any[] {
  if (match.status !== "live") {
    return [];
  }

  const markets = [];
  for (let i = 0; i < 8; i++) {
    const market = generateLiveMarket(match, i);
    if (market) {
      markets.push(market);
    }
  }

  return markets;
}

export function getTimeRemainingSeconds(market: any): number {
  const now = Date.now();
  const timeLeft = (market.expiresAt - now) / 1000;
  return Math.max(0, Math.ceil(timeLeft));
}
