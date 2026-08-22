import { Badge } from "@/components/ui/Badge";
import type { Position } from "@/types";

export function PositionStatus({ status }: Pick<Position, "status">) {
  const tone = status === "won" ? "success" : status === "lost" ? "danger" : "default";
  return <Badge tone={tone}>{status}</Badge>;
}
