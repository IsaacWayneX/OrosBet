import type { Match } from "@/types";
import { LiveIndicator } from "./LiveIndicator";
import { MatchScore } from "./MatchScore";

export function MatchHeader({ match }: { match: Match }) {
  return (
    <div className="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-between py-2">
      <div>
        <div className="flex items-center gap-2">
          {match.leagueDetail?.imagePath && (
            <img 
              src={match.leagueDetail.imagePath} 
              alt={match.leagueDetail.name} 
              className="h-5 w-5 object-contain" 
            />
          )}
          <p className="text-sm font-semibold text-slate-400">
            {match.leagueDetail?.name || match.league || "Featured Match"}
          </p>
        </div>
        <MatchScore match={match} />
      </div>
      
      {/* Venue/Match Status Details */}
      <div className="flex flex-col items-start md:items-end gap-2 text-xs text-slate-400">
        {match.status === "live" ? (
          <LiveIndicator />
        ) : (
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wider text-[10px] text-slate-300 font-semibold">
            {match.status}
          </span>
        )}
        
        {match.venue && (
          <div className="flex items-center gap-1.5 mt-1 bg-black/10 dark:bg-white/5 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5">
            <span>🏟️</span>
            <span>
              {match.venue.name}, {match.venue.city} (Cap: {match.venue.capacity.toLocaleString()})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
