import { Card } from "@/components/ui/Card";
import type { NotificationItem } from "@/types";

export function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <Card>
      <h3 className="font-semibold">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-300">{item.body}</p>
      <p className="mt-3 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
    </Card>
  );
}
