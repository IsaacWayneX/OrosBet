import type { NotificationItem } from "@/types";
import { NotificationCard } from "./NotificationCard";

export function NotificationList({ items }: { items: NotificationItem[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <NotificationCard key={item.id} item={item} />
      ))}
    </div>
  );
}
