import { LiveMatchCard } from "@/components/live/LiveMatchCard";
import { getUpcomingMatches } from "@/lib/api";
import { SportsHero } from "@/components/layout/SportsHero";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UpcomingPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search.toLowerCase() : "";

  let matches = await getUpcomingMatches();

  // Text search filter
  if (search) {
    matches = matches.filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(search) ||
        m.awayTeam.toLowerCase().includes(search) ||
        (m.league && m.league.toLowerCase().includes(search))
    );
  }

  // Remove duplicates by ID to avoid React warning
  const uniqueMatches = matches.filter(
    (match, index, self) => self.findIndex((m) => m.id === match.id) === index
  );

  return (
    <div className="space-y-6">
      <SportsHero />

      <div>
        <h1 className="text-3xl font-semibold">Starting Soon</h1>
        <p className="mt-2 text-sm text-slate-400">Upcoming matches and events.</p>
      </div>
      
      {uniqueMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-border/40 rounded-lg bg-card text-muted">
          <p className="text-sm font-semibold">No upcoming matches</p>
          <p className="text-xs mt-1">Check back soon for more events.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {uniqueMatches.map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
