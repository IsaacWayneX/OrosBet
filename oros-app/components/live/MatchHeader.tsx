import type { Match } from "@/types";
import { LiveIndicator } from "./LiveIndicator";
import { MatchScore } from "./MatchScore";

export function MatchHeader({ match }: { match: Match }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-slate-400">{match.league || "Featured Match"}</p>
        <MatchScore match={match} />
      </div>
      {match.status === "live" ? <LiveIndicator /> : <span className="text-sm text-slate-400">{match.status}</span>}
    </div>
  );
}
