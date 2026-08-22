import type { MatchEvent } from "@/types";
import { Card } from "@/components/ui/Card";

export function EventTimeline({ events = [] }: { events?: MatchEvent[] }) {
  // Sort events so latest minute is at the top
  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

  const getEventEmoji = (type: string) => {
    switch (type.toLowerCase()) {
      case "goal":
        return "⚽";
      case "yellowcard":
        return "🟨";
      case "redcard":
        return "🟥";
      case "substitution":
        return "🔄";
      case "corner":
      case "corner_awarded":
        return "🚩";
      case "shot_on_target":
        return "🎯";
      default:
        return "📢";
    }
  };

  return (
    <div className="space-y-3">
      {sortedEvents.length === 0 ? (
        <Card className="p-6 text-center text-slate-400 text-sm">
          No live timeline events logged yet for this match.
        </Card>
      ) : (
        sortedEvents.map((event) => (
          <Card key={event.id} className="p-4 border-l-4 border-l-accent transition hover:border-l-accent-secondary">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Player image or default emoji */}
                {event.playerImage ? (
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 bg-slate-800 flex-shrink-0">
                    <img 
                      src={event.playerImage} 
                      alt={event.playerName} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-black/10 dark:bg-white/5 border border-white/5 text-lg flex-shrink-0">
                    {getEventEmoji(event.type)}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-bold text-accent-secondary tracking-wide uppercase">
                      {event.team}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-accent text-white dark:bg-black/20 dark:text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
                      {event.type}
                    </span>
                    {event.result && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                        Score: {event.result}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-200 truncate pr-4" title={event.commentary}>
                    {event.commentary}
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <span className="text-[13px] font-bold bg-accent text-white dark:bg-white/5 dark:text-slate-400 px-2 py-1 rounded font-mono">
                  {event.minute}&apos;
                </span>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
