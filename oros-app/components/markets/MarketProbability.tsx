import { formatPercent } from "@/lib/utils";

export function MarketProbability({ yes, no }: { yes: number; no: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>YES {formatPercent(yes)}</span>
        <span>NO {formatPercent(no)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-accent" style={{ width: `${yes}%` }} />
      </div>
    </div>
  );
}
