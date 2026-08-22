import { LiveMatchCard } from "@/components/live/LiveMatchCard";
import { getLiveMatches } from "@/lib/api";
import { SportsHero } from "@/components/layout/SportsHero";

export default async function ActivityPage() {
  const matches = await getLiveMatches();

  return (
    <div className="space-y-6">
      <SportsHero />

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
            <img 
              src="/empty/ronaldo.png" 
              alt="Ronaldo" 
              className="w-96 h-96 object-contain mb-4"
            />
            <p className="text-lg font-semibold">No live matches to bet on but heres a photo of ronaldo SUI!!!!!</p>
          </div>
        )}
      </section>
    </div>
  );
}
