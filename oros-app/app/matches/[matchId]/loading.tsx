import { Skeleton } from "@/components/ui/Skeleton";

export default function MatchDetailsLoading() {
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <Skeleton className="h-9 w-96 rounded-lg" />
          <Skeleton className="h-4 w-48 mt-3 rounded-lg" />
        </div>

        {/* Match Info Card */}
        <div className="rounded-lg bg-card border border-border/40 p-6">
          <div className="flex items-center justify-between gap-8 mb-6">
            <div className="flex-1 text-center space-y-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-5 w-24 mx-auto rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
            <div className="flex-1 text-center space-y-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-5 w-24 mx-auto rounded-lg" />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Timeline Skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/40 rounded-lg p-4 flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded-lg" />
                <Skeleton className="h-3 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Markets Skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/40 rounded-lg p-4 space-y-3">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-3 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
