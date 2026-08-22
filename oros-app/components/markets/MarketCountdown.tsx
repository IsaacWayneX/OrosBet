import { timeFromNow } from "@/lib/utils";

export function MarketCountdown({ deadline }: { deadline: string }) {
  return <span className="text-sm text-slate-400">Ends in {timeFromNow(deadline)}</span>;
}
