import type { Market } from "@/types";
import { MarketCountdown } from "./MarketCountdown";

export function MarketHeader({ market }: { market: Market }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{market.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">{market.description}</p>
      </div>
      <MarketCountdown deadline={market.resolutionDeadline} />
    </div>
  );
}
