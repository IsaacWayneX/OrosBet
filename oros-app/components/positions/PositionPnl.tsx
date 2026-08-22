import { formatCurrency } from "@/lib/utils";

export function PositionPnl({ pnl }: { pnl: number }) {
  return <span className={pnl >= 0 ? "text-emerald-300" : "text-rose-300"}>{pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}</span>;
}
