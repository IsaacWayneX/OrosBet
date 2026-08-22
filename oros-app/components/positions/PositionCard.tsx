import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { Position } from "@/types";
import { PositionPnl } from "./PositionPnl";
import { PositionStatus } from "./PositionStatus";

export function PositionCard({ position }: { position: Position }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{position.marketTitle}</h3>
          <p className="mt-1 text-sm text-slate-400">{position.side.toUpperCase()} · Stake {formatCurrency(position.amount)}</p>
        </div>
        <PositionStatus status={position.status} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-400">PnL</span>
        <PositionPnl pnl={position.pnl} />
      </div>
    </Card>
  );
}
