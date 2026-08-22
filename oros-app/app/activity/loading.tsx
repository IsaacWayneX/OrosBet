import { Skeleton } from "@/components/ui/Skeleton";

export default function ActivityLoading() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Live now</h1>
        <p className="mt-2 text-sm text-slate-400">Open access browsing with wallet actions layered in later.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full rounded-lg" />
        ))}
      </section>
    </div>
  );
}
