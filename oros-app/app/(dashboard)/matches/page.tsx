import { LiveMatchCard } from "@/components/live/LiveMatchCard";
import { getMatches } from "@/lib/api";

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Matches</h1>
        <p className="mt-2 text-sm text-slate-400">Browse live and upcoming fixtures without a hard auth wall.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {matches.map((match) => (
          <LiveMatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
