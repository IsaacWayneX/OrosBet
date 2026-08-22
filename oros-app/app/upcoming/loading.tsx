import { Skeleton } from "@/components/ui/Skeleton";

export default function UpcomingLoading() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold">Starting Soon</h1>
        <p className="mt-2 text-sm text-slate-400">Upcoming matches and events.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full rounded-lg" />
        ))}
      </section>
    </div>
  );
}
