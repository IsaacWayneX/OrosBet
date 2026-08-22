"use client";

import { PositionList } from "@/components/positions/PositionList";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePositions } from "@/hooks/usePositions";

export default function PositionsPage() {
  const { data, loading } = usePositions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">My positions</h1>
        <p className="mt-2 text-sm text-slate-400">Anonymous browsing stays open; personal state becomes richer when connected.</p>
      </div>
      {loading ? <Skeleton className="h-40 w-full" /> : <PositionList positions={data} />}
    </div>
  );
}
