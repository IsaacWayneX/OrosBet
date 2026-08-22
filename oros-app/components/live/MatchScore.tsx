import type { Match } from "@/types";

export function MatchScore({ match }: { match: Match }) {
  return (
    <div className="flex items-center gap-3 text-xl font-semibold">
      {match.homeLogo && (
        <img src={match.homeLogo} alt={match.homeTeam} className="h-6 w-6 rounded-full object-cover" />
      )}
      <span>{match.homeTeam}</span>
      <span className="rounded-xl bg-white/8 px-3 py-1">{match.homeScore} - {match.awayScore}</span>
      <span>{match.awayTeam}</span>
      {match.awayLogo && (
        <img src={match.awayLogo} alt={match.awayTeam} className="h-6 w-6 rounded-full object-cover" />
      )}
    </div>
  );
}
