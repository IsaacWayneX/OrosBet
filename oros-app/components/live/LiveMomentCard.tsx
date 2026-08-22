import { Card } from "@/components/ui/Card";
import type { MatchEvent } from "@/types";

export function LiveMomentCard({ event }: { event: MatchEvent }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.2em] text-accent-2">Moment</p>
      <h3 className="mt-2 text-base font-semibold">{event.team} · {event.minute}&apos;</h3>
      <p className="mt-2 text-sm text-slate-300">{event.commentary}</p>
    </Card>
  );
}
