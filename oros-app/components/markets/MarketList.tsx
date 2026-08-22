import type { Market } from "@/types";
import { MarketCard } from "./MarketCard";

export function MarketList({ markets }: { markets: Market[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}
