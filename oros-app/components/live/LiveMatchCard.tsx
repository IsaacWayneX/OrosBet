"use client";

import Link from "next/link";
import { cn, formatCompactNumber, timeFromNow } from "@/lib/utils";
import type { Match } from "@/types";

interface LiveMatchCardProps {
  match: Match;
  className?: string;
}

export function LiveMatchCard({ match, className }: LiveMatchCardProps) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-lg bg-card shadow-lg", className)}>
      
      {/* Top Section: Header & Matchup */}
      <div className="flex h-[101px] flex-col justify-between p-4 bg-card">
        {/* Status bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-4 items-center justify-center rounded bg-border px-1.5 text-[12px] font-bold text-white uppercase">
              {match.status === "live" ? (match.minute ? `${match.minute}'` : "LIVE") : timeFromNow(match.startedAt || "")}
            </span>
            <div className="flex items-center gap-2">
              <button className="text-muted hover:text-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
              <button className="text-muted hover:text-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            <span className="text-[14px] font-semibold text-foreground">{formatCompactNumber(42110)}</span>
          </div>
        </div>

        {/* Teams Display */}
        <Link href={`/matches/${match.id}`} className="flex items-center justify-between group">
          <div className="flex h-9 w-9 items-center justify-center">
             {match.homeLogo ? (
               <img src={match.homeLogo} alt={match.homeTeam} className="h-full w-full object-contain" />
             ) : (
               <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-gradient-to-b from-[#ECF3F9] to-[#BBCADA]">
                 <span className="text-[10px] font-bold text-slate-800">{match.homeTeam.slice(0,2).toUpperCase()}</span>
               </div>
             )}
          </div>
          <div className="flex flex-col items-center">
             <span className="text-[15.6px] font-semibold text-foreground group-hover:text-accent-secondary transition-colors">{match.homeTeam}</span>
             <span className="text-[15px] font-semibold text-foreground group-hover:text-accent-secondary transition-colors">{match.awayTeam}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center">
             {match.awayLogo ? (
               <img src={match.awayLogo} alt={match.awayTeam} className="h-full w-full object-contain" />
             ) : (
               <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-gradient-to-b from-[#ECF3F9] to-[#BBCADA]">
                 <span className="text-[10px] font-bold text-slate-800">{match.awayTeam.slice(0,2).toUpperCase()}</span>
               </div>
             )}
          </div>
        </Link>
      </div>

      {/* Middle Section: Sentiment/Overlay */}
      <div className="relative flex h-[116px] flex-col justify-start p-4 bg-card border-y border-border/20">
        <div className="flex items-center gap-1 mb-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-warning"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-warning"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-warning"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <p className="text-[13.1px] font-semibold text-muted leading-tight">
          98% of 1x2 bets on {match.awayTeam}
        </p>
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex h-14 w-full items-center gap-2">
            {/* 1x2 Buttons */}
            <button className="flex flex-1 flex-col items-center justify-center rounded-lg bg-black/30 py-2 transition hover:bg-black/40">
              <span className="text-[14px] text-foreground opacity-80">{match.homeTeam.slice(0, 8)}</span>
              <span className="text-[14px] font-bold text-accent-secondary">8.40</span>
            </button>
            <button className="flex flex-1 flex-col items-center justify-center rounded-lg bg-black/30 py-2 transition hover:bg-black/40">
              <span className="text-[14px] text-foreground opacity-80">Draw</span>
              <span className="text-[14px] font-bold text-accent-secondary">5.60</span>
            </button>
            <button className="flex flex-1 flex-col items-center justify-center rounded-lg bg-black/30 py-2 transition hover:bg-black/40">
              <span className="text-[14px] text-foreground opacity-80">{match.awayTeam.slice(0, 8)}</span>
              <span className="text-[14px] font-bold text-accent-secondary">1.35</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
