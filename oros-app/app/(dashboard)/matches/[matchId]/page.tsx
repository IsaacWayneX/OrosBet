import { EventTimeline } from "@/components/live/EventTimeline";
import { MatchHeader } from "@/components/live/MatchHeader";
import { MarketList } from "@/components/markets/MarketList";
import { LiveInteractiveMarkets } from "@/components/markets/LiveInteractiveMarkets";
import { Card } from "@/components/ui/Card";
import { getMarket, getMarkets, getMatch } from "@/lib/api";

export default async function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const match = await getMatch(matchId);
  const markets = (await getMarkets()).filter((market) => market.matchId === matchId);

  if (!match) {
    return <Card>Match not found.</Card>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <MatchHeader match={match} />
      </Card>
      
      <LiveInteractiveMarkets matchId={matchId} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Live markets</h2>
        <MarketList markets={markets} />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Event timeline</h2>
        <EventTimeline events={match.events} />
      </section>
    </div>
  );
}
