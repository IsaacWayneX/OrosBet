import { LiveMatchCard } from "@/components/live/LiveMatchCard";
import { LiveMomentCard } from "@/components/live/LiveMomentCard";
import { MarketList } from "@/components/markets/MarketList";
import { Card } from "@/components/ui/Card";
import { getMarkets, getMatches } from "@/lib/api";

export default async function DashboardHomePage() {
  const matches = await getMatches();
  const markets = await getMarkets();
  const featuredMatch = matches[0];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Live now</h1>
        <p className="mt-2 text-sm text-slate-400">Open access browsing with wallet actions layered in later.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
        {matches.map((match) => (
          <LiveMatchCard key={match.id} match={match} />
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Featured markets</h2>
          <p className="text-sm text-slate-400">Loaded from the Express backend market endpoints, with graceful UI fallbacks.</p>
        </div>
        <MarketList markets={markets} />
      </section>
    </div>
  );
}
