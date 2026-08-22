import { NotificationList } from "@/components/notifications/NotificationList";
import { getNotifications } from "@/lib/api";

export default async function NotificationsPage() {
  const items = await getNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Notifications</h1>
        <p className="mt-2 text-sm text-slate-400">Price movement, wallet state, and market updates.</p>
      </div>
      <NotificationList items={items} />
    </div>
  );
}
