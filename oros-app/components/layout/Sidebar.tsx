"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Live Events", icon: "live", badge: "81" },
  { href: "/matches", label: "Starting Soon", icon: "soon" },
  { href: "/all", label: "All", icon: "all" },
  { href: "/positions", label: "My Bets", icon: "bets" },
];

const topSports = [
  { href: "/sports/soccer", label: "Soccer", icon: "soccer" },
  { href: "/sports/tennis", label: "Tennis", icon: "tennis" },
  { href: "/sports/baseball", label: "Baseball", icon: "baseball" },
  { href: "/sports/cricket", label: "Cricket", icon: "cricket" },
  { href: "/sports/basketball", label: "Basketball", icon: "basketball" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[60px] hidden h-[calc(100vh-60px)] w-[260px] flex-col items-start bg-[#0E202D] shadow-[0_0_5px_rgba(25,25,25,0.25)] lg:flex">
      
      {/* Top Toggle Switcher: Casino/Sports Style */}
      <div className="flex h-[60px] w-full items-center justify-center px-4">
        <div className="flex h-[36px] w-full gap-[2px] rounded-lg bg-black/20 p-[2px]">
          <button className="flex flex-1 items-center justify-center rounded-md bg-[#213545] text-[15.3px] font-semibold text-[#ECF3F9] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
            Markets
          </button>
          <button className="flex flex-1 items-center justify-center rounded-md text-[14.9px] font-semibold text-[#A1BFD6] transition hover:text-[#ECF3F9]">
            Portfolio
          </button>
        </div>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="w-full flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {/* Navigation Group 1 */}
        <div className="flex flex-col overflow-hidden">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex h-12 items-center gap-2 px-4 transition-colors group",
                pathname === link.href ? "bg-white/5 text-[#ECF3F9]" : "text-[#ECF3F9] hover:bg-white/5"
              )}
            >
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
          ))}

          {/* Separator */}
          <div className="mx-4 py-2">
            <div className="h-[1px] w-full bg-[#3E586C]" />
          </div>

          {/* Section Heading */}
          <div className="px-4 py-2">
            <span className="text-[14.4px] font-bold uppercase tracking-tight text-[#A1BFD6]">Top Sports</span>
          </div>

          {/* Sports List */}
          {topSports.map((link) => (
            <button
              key={link.label}
              className="flex h-12 w-full items-center justify-between px-4 text-[#ECF3F9] transition-colors hover:bg-white/5 group"
            >
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 text-[#A1BFD6]">
                  {getIcon(link.icon)}
                </div>
                <span className="text-[14.9px] font-semibold">{link.label}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#A1BFD6] opacity-0 transition-opacity group-hover:opacity-100">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>
      </div>


    </aside>
  );
}

function getIcon(name: string) {
  switch (name) {
    case "live":
      return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "soon":
      return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.5-13h1v6l5.25 3.15-.75 1.23L11.5 14V7z"/></svg>;
    case "all":
      return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 18h17v-2H4v2zm0-5h17v-2H4v2zm0-7v2h17V6H4z"/></svg>;
    case "bets":
      return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>;
    case "soccer":
      return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.5-9l-1.41-1.41L12 12.17l-3.09-3.58L7.5 10l4.5 5.25L16.5 11z"/></svg>;
    case "tennis":
      return <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 2c0 5.52 4.48 10 10 10M2 12c5.52 0 10 4.48 10 10"/></svg>;
    case "baseball":
      return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/></svg>;
    default:
      return null;
  }
}
