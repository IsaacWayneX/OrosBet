import { Card } from "@/components/ui/Card";

const activities = [
  { id: 1, label: "Bought YES on Arsenal next goal", status: "confirmed", time: "2m ago" },
  { id: 2, label: "Claimed faucet balance", status: "confirmed", time: "1h ago" },
];

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Activity</h1>
        <p className="mt-2 text-sm text-slate-400">Recent wallet and market actions.</p>
      </div>
      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">{activity.label}</h3>
                <p className="mt-1 text-sm text-slate-400">{activity.time}</p>
              </div>
              <span className="text-sm text-emerald-300">{activity.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
