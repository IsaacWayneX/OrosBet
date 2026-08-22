import type { Position } from "@/types";
import { PositionCard } from "./PositionCard";

export function PositionList({ positions }: { positions: Position[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {positions.map((position) => (
        <PositionCard key={position.id} position={position} />
      ))}
    </div>
  );
}
