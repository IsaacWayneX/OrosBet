import type { MatchEvent } from "@/types";
import { Card } from "@/components/ui/Card";

export function EventTimeline({ events = [] }: { events?: MatchEvent[] }) {
  return (
    <div className="grid gap-3">
      {events.map((event) => (
        <Card key={event.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{event.team}</p>
              <p className="mt-1 text-sm text-slate-300">{event.commentary}</p>
            </div>
            <span className="text-xs text-slate-400">{event.minute}&apos;</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
