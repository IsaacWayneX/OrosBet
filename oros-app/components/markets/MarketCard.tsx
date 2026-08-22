import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatCompactNumber } from "@/lib/utils";
import type { Market } from "@/types";
import { MarketProbability } from "./MarketProbability";
import { MarketCountdown } from "./MarketCountdown";

export function MarketCard({ market }: { market: Market }) {
  return (
    <Link href={`/markets/${market.id}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:border-white/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{market.title}</h3>
            <p className="mt-1 text-sm text-slate-400">Vol {formatCompactNumber(market.volume)}</p>
          </div>
          <MarketCountdown deadline={market.resolutionDeadline} />
        </div>
        <div className="mt-4">
          <MarketProbability yes={market.probabilityYes} no={market.probabilityNo} />
        </div>
      </Card>
    </Link>
  );
}
