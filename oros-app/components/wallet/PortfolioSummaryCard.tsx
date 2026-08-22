"use client";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import { usePortfolio } from "@/hooks/usePortfolio";

export function PortfolioSummaryCard() {
  const { data, loading } = usePortfolio();

  if (loading || !data) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <Card>
      <h3 className="font-semibold">Portfolio summary</h3>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <p>Total balance: {formatCurrency(data.totalBalance)}</p>
        <p>Total gain: {formatCurrency(data.totalGain)}</p>
        <p>Active positions: {data.activePositions}</p>
        <p>Resolved positions: {data.resolvedPositions}</p>
        <p>Unrealized PnL: {formatCurrency(data.unrealizedPnL)}</p>
        <p>Realized PnL: {formatCurrency(data.realizedPnL)}</p>
      </div>
    </Card>
  );
}
