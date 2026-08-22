"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, Clock, Layers, TrendingUp } from "lucide-react";

const mainLinks = [
  { href: "/activity", label: "Live Events", icon: "live", badge: "81" },
  { href: "/upcoming", label: "Starting Soon", icon: "soon" },
  { href: "/notifications", label: "Activity", icon: "all" },
  { href: "/positions", label: "My Bets", icon: "bets" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col items-start bg-background-sidebar border-r border-border/40 lg:flex">
      
      {/* Top Toggle Switcher: Casino/Sports Style */}
      <div className="flex h-[60px] w-full items-center justify-between px-4 border-b border-border/40 gap-3">
        <Link href="/" className="flex items-center transition hover:opacity-80 flex-shrink-0">
          <img src="/oros.png" alt="Oros Logo" className="h-8 w-auto logo-filter" />
        </Link>
        <div className="flex h-9 flex-1 gap-1.5 p-0">
          <button className="flex flex-1 items-center justify-center rounded-lg bg-black/10 dark:bg-[#213545] text-[13.5px] font-semibold text-foreground px-1.5">
            Markets
          </button>
          <button className="flex flex-1 items-center justify-center rounded-lg text-[13.2px] font-semibold text-muted hover:text-foreground transition px-1.5">
            Portfolio
          </button>
        </div>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="w-full flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {/* Navigation Group 1 */}
        <div className="flex flex-col overflow-hidden">
          {mainLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-12 items-center gap-2 px-4 transition-colors group relative",
                  active ? "bg-white/5 text-[#ECF3F9]" : "text-[#ECF3F9] hover:bg-white/5"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1475E1] rounded-r-full" />
                )}
                <div className="h-5 w-5 flex-shrink-0 text-[#A1BFD6]">
                  {getIcon(link.icon)}
                </div>
                <span className="flex-1 text-[15.1px] font-semibold">
                  {link.label}
                </span>
                {link.badge && (
                  <span className="flex h-4 min-w-[30px] items-center justify-center rounded-full bg-[#1475E1] px-2 text-[12px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function getIcon(name: string) {
  switch (name) {
    case "live":
      return <Activity className="h-5 w-5 stroke-[2.5px]" />;
    case "soon":
      return <Clock className="h-5 w-5 stroke-[2.5px]" />;
    case "all":
      return <Layers className="h-5 w-5 stroke-[2.5px]" />;
    case "bets":
      return <TrendingUp className="h-5 w-5 stroke-[2.5px]" />;
    default:
      return null;
  }
}
