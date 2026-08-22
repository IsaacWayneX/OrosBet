import { LiveMatchCard } from "@/components/live/LiveMatchCard";
import { getLiveMatches } from "@/lib/api";

export default async function ActivityPage() {
  const matches = await getLiveMatches();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Live now</h1>
        <p className="mt-2 text-sm text-slate-400">Open access browsing with wallet actions layered in later.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
        {matches.length > 0 ? (
          matches.map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-border/40 rounded-lg bg-card text-muted md:col-span-2">
            <p className="text-sm font-semibold">No live matches</p>
            <p className="text-xs mt-1">Check back soon for live games.</p>
          </div>
        )}
      </section>
    </div>
  );
}
