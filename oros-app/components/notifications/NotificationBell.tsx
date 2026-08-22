import Link from "next/link";

export function NotificationBell() {
  return (
    <Link href="/notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-sm">
      🔔
      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
    </Link>
  );
}
