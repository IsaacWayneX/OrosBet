import { BACKEND_URL } from "./constants";
import type {
  FaucetClaimResult,
  Match,
  Market,
  NotificationItem,
  PortfolioSummary,
  Position,
} from "@/types";

const fallbackMatches: Match[] = [
  {
    id: "mock-arsenal-barcelona",
    homeTeam: "Arsenal",
    awayTeam: "Barcelona",
    status: "live",
    homeScore: 1,
    awayScore: 1,
    minute: 68,
    league: "Featured",
    startedAt: new Date(Date.now() - 68 * 60 * 1000).toISOString(),
    events: [
      {
        id: "mock-1",
        minute: 68,
        team: "Arsenal",
        type: "dangerous_attack",
        commentary: "Saka wins a corner after a sharp run.",
      },
    ],
  },
];

const fallbackMarkets: Market[] = [
  {
    id: "market-demo-1",
    matchId: "mock-arsenal-barcelona",
    title: "Will Arsenal score next?",
    description: "Live binary market linked to current match momentum.",
    outcomeYesPrice: 0.62,
    outcomeNoPrice: 0.38,
    probabilityYes: 62,
    probabilityNo: 38,
    volume: 18240,
    liquidity: 50000,
    status: "open",
    resolutionDeadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  },
];

const fallbackNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Connected to backend",
    body: "This app now attempts to consume Express APIs and falls back gracefully when data is missing.",
    createdAt: new Date().toISOString(),
    read: false,
    kind: "system",
  },
];

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

function safeNumber(value: string | number | null | undefined, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function weiToTokenAmount(value: string | number | null | undefined) {
  return safeNumber(value) / 1e18;
}

function normalizeFixture(fixture: any): Match {
  return {
    id: String(fixture.id),
    homeTeam: fixture.home_team || "Home",
    homeLogo: fixture.home_logo,
    awayTeam: fixture.away_team || "Away",
    awayLogo: fixture.away_logo,
    status: fixture.status || "scheduled",
    startedAt: fixture.started_at,
    homeScore: safeNumber(fixture.home_score),
    awayScore: safeNumber(fixture.away_score),
    minute: fixture.minute ?? null,
    league: fixture.league || "Featured",
  };
}

function normalizeMatchDetail(match: any, events: any[] = []): Match {
  return {
    id: String(match.match_id || match.id),
    homeTeam: match.home_team || "Home",
    homeLogo: match.home_logo,
    awayTeam: match.away_team || "Away",
    awayLogo: match.away_logo,
    status: match.status || "scheduled",
    startedAt: match.started_at,
    homeScore: safeNumber(match.home_score),
    awayScore: safeNumber(match.away_score),
    minute: match.minute ?? null,
    league: match.league?.name || match.league || "Featured",
    leagueDetail: match.league ? {
      name: match.league.name,
      shortCode: match.league.short_code,
      imagePath: match.league.image_path,
    } : undefined,
    venue: match.venue ? {
      name: match.venue.name,
      city: match.venue.city,
      capacity: match.venue.capacity,
      surface: match.venue.surface,
      imagePath: match.venue.image_path,
    } : undefined,
    events: events.map((event) => ({
      id: String(event.id || `${match.match_id || match.id}-${safeNumber(event.minute)}-${event.type || "event"}`),
      minute: safeNumber(event.minute),
      team: event.team || "Unknown",
      type: event.type || "event",
      commentary: event.commentary || event.description || "Live event",
      playerName: event.playerName,
      playerImage: event.playerImage,
      result: event.result,
    })),
  };
}

function marketTitleFromDescription(description?: string) {
  return description?.trim() || "Untitled market";
}

function normalizeMarket(market: any): Market {
  const deadline = market.resolutionDeadline
    ? new Date(Number(market.resolutionDeadline)).toISOString()
    : new Date(Date.now() + 60 * 60 * 1000).toISOString();

  return {
    id: String(market.id),
    matchId: String(market.matchId || market.match_id || "unlinked"),
    title: marketTitleFromDescription(market.description || market.title),
    description: market.description || "Binary market from backend",
    outcomeYesPrice: 0.5,
    outcomeNoPrice: 0.5,
    probabilityYes: 50,
    probabilityNo: 50,
    volume: safeNumber(market.volume),
    liquidity: safeNumber(market.liquidity, 1000),
    status: market.resolved ? "resolved" : "open",
    resolutionDeadline: deadline,
    result: market.resolved ? "yes" : undefined,
  };
}

function normalizePosition(position: any): Position {
  const amount = weiToTokenAmount(position.tokenAmount);
  const shares = weiToTokenAmount(position.shares);

  return {
    id: `position-${position.marketId}-${position.outcomeId}`,
    marketId: String(position.marketId),
    marketTitle: `Market #${position.marketId}`,
    side: Number(position.outcomeId) === 0 ? "yes" : "no",
    amount,
    shares,
    avgPrice: shares > 0 ? amount / shares : 0,
    currentPrice: shares > 0 ? amount / shares : 0,
    pnl: 0,
    status: position.status === "active" ? "active" : "active",
  };
}

export async function getMatches(): Promise<Match[]> {
  try {
    const [live, upcoming] = await Promise.all([
      requestJson<{ fixtures: any[] }>("/api/v1/livegames"),
      requestJson<{ fixtures: any[] }>("/api/v1/livegames/upcoming"),
    ]);

    const merged = [...(live.fixtures || []), ...(upcoming.fixtures || [])].map(normalizeFixture);
    return merged.length > 0 ? merged : fallbackMatches;
  } catch {
    return fallbackMatches;
  }
}

export async function getMatch(matchId: string): Promise<Match | null> {
  try {
    const data = await requestJson<{ match: any; events: any[] }>(`/api/v1/livegames/${matchId}`);
    return normalizeMatchDetail(data.match, data.events || []);
  } catch {
    const matches = await getMatches();
    return matches.find((item) => item.id === matchId) || null;
  }
}

export async function getMarkets(): Promise<Market[]> {
  try {
    const data = await requestJson<{ markets: any[] }>("/api/v1/markets");
    const markets = (data.markets || []).map(normalizeMarket);
    return markets.length > 0 ? markets : fallbackMarkets;
  } catch {
    return fallbackMarkets;
  }
}

export async function getMarket(marketId: string): Promise<Market | null> {
  try {
    const data = await requestJson<{ market: any }>(`/api/v1/markets/${marketId}`);
    return normalizeMarket(data.market);
  } catch {
    const markets = await getMarkets();
    return markets.find((market) => market.id === marketId) || null;
  }
}

export async function createMarket(input: {
  description: string;
  outcomes: [string, string];
  resolutionDeadline: number;
  initialLiquidity?: string | number;
}) {
  return requestJson<{ market: any; timestamp: string }>("/api/v1/markets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function resolveMarket(marketId: string, correctOutcome: 0 | 1) {
  return requestJson<{ market: { id: string; resolved: boolean; correctOutcome: 0 | 1 }; txHash: string | null }>(
    `/api/v1/markets/${marketId}/resolve`,
    {
      method: "POST",
      body: JSON.stringify({ correctOutcome }),
    }
  );
}

export async function getPositions(): Promise<Position[]> {
  try {
    const data = await requestJson<{ positions: any[] }>("/api/v1/user/positions");
    return (data.positions || []).map(normalizePosition);
  } catch {
    return [];
  }
}

export async function getPortfolio(): Promise<PortfolioSummary> {
  try {
    const data = await requestJson<{ portfolio: any }>("/api/v1/user/portfolio");
    return {
      totalBalance: weiToTokenAmount(data.portfolio?.totalBalance),
      totalGain: weiToTokenAmount(data.portfolio?.totalGain),
      activePositions: safeNumber(data.portfolio?.activePositions),
      resolvedPositions: safeNumber(data.portfolio?.resolvedPositions),
      unrealizedPnL: weiToTokenAmount(data.portfolio?.unrealizedPnL),
      realizedPnL: weiToTokenAmount(data.portfolio?.realizedPnL),
    };
  } catch {
    return {
      totalBalance: 0,
      totalGain: 0,
      activePositions: 0,
      resolvedPositions: 0,
      unrealizedPnL: 0,
      realizedPnL: 0,
    };
  }
}

export async function getCurrentUser() {
  try {
    const data = await requestJson<{ user: { id: string; address: string; balance: string } }>("/api/v1/user/me");
    return {
      id: data.user.id,
      address: data.user.address,
      balance: weiToTokenAmount(data.user.balance),
    };
  } catch {
    return {
      id: "guest",
      address: null,
      balance: 0,
    };
  }
}

export async function claimFaucet(address: string): Promise<FaucetClaimResult> {
  return requestJson<FaucetClaimResult>("/api/v1/faucet/claim", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const markets = await getMarkets();
  const live = await getMatches();

  const marketNotifications = markets.slice(0, 2).map((market, index) => ({
    id: `market-${market.id}`,
    title: `Market live: ${market.title}`,
    body: `Current split YES ${market.probabilityYes}% / NO ${market.probabilityNo}%.`,
    createdAt: new Date(Date.now() - index * 10 * 60 * 1000).toISOString(),
    read: index > 0,
    kind: "market" as const,
  }));

  const matchNotifications = live.slice(0, 1).map((match) => ({
    id: `match-${match.id}`,
    title: `${match.homeTeam} vs ${match.awayTeam}`,
    body: match.status === "live" ? `Live at ${match.minute ?? 0}'` : "Upcoming fixture available.",
    createdAt: new Date().toISOString(),
    read: false,
    kind: "system" as const,
  }));

  const combined = [...matchNotifications, ...marketNotifications];
  return combined.length > 0 ? combined : fallbackNotifications;
}
