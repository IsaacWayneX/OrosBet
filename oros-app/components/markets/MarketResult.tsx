import { Badge } from "@/components/ui/Badge";

export function MarketResult({ result }: { result?: "yes" | "no" }) {
  if (!result) return <Badge>Pending</Badge>;
  return <Badge tone="success">Resolved: {result.toUpperCase()}</Badge>;
}
