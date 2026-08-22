"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MarketHeader } from "@/components/markets/MarketHeader";
import { MarketProbability } from "@/components/markets/MarketProbability";
import { PositionModal } from "@/components/markets/PositionModal";
import { YesNoButtons } from "@/components/markets/YesNoButtons";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMarket } from "@/hooks/useMarket";
import { formatCompactNumber } from "@/lib/utils";

export default function MarketDetailPage() {
  const params = useParams<{ marketId: string }>();
  const { data: market, loading } = useMarket(params.marketId);
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [open, setOpen] = useState(false);

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (!market) return <Card>Market not found.</Card>;

  return (
    <div className="space-y-6">
      <Card>
        <MarketHeader market={market} />
      </Card>
      <Card className="space-y-4">
        <MarketProbability yes={market.probabilityYes} no={market.probabilityNo} />
        <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
          <p>Volume: {formatCompactNumber(market.volume)}</p>
          <p>Liquidity: {formatCompactNumber(market.liquidity)}</p>
        </div>
        <YesNoButtons
          onYes={() => {
            setSide("yes");
            setOpen(true);
          }}
          onNo={() => {
            setSide("no");
            setOpen(true);
          }}
        />
      </Card>
      <PositionModal open={open} side={side} />
    </div>
  );
}
