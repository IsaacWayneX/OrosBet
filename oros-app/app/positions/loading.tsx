import { Skeleton } from "@/components/ui/Skeleton";

export default function PositionsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">My positions</h1>
        <p className="mt-2 text-sm text-slate-400">Anonymous browsing stays open; personal state becomes richer when connected.</p>
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
