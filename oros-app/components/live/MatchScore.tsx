import type { Match } from "@/types";

export function MatchScore({ match }: { match: Match }) {
  return (
    <div className="flex items-center gap-3 text-xl font-semibold">
      <span>{match.homeTeam}</span>
      <span className="rounded-xl bg-white/8 px-3 py-1">{match.homeScore} - {match.awayScore}</span>
      <span>{match.awayTeam}</span>
    </div>
  );
}
