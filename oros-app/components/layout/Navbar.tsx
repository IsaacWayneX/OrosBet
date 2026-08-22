"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";

export function Navbar() {
  const wallet = useWallet();

  return (
    <header className="sticky top-0 z-50 flex h-[60px] w-full items-center justify-center bg-[#0E202D] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-1px_rgba(0,0,0,0.12)]">
      <div className="flex h-full w-full max-w-[1200px] items-center justify-between px-4 lg:px-6">
        
        {/* Left: Logo/Home */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex h-10 items-center justify-center rounded px-2 text-lg font-bold tracking-tight text-foreground transition hover:opacity-80">
            {APP_NAME.toUpperCase()}
          </Link>
        </div>

        {/* Center: Wallet/Currency Controls */}
        <div className="flex h-12 items-center">
          <div className="flex items-center gap-[0.01px]">
            {/* Currency Selector / Balance */}
            <button className="flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-l-lg bg-black/30 px-5 shadow-inner transition hover:bg-black/40">
              <span className="text-[15px] font-semibold text-foreground">
                {wallet.connected ? wallet.balance.toFixed(8) : "0.00000000"}
              </span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#26A17B]">
                <div className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="m6 9 6 6 6-9"/>
              </svg>
            </button>

            {/* Wallet Button */}
            <button 
              onClick={wallet.connected ? undefined : wallet.connect}
              className="flex h-12 items-center justify-center rounded-r-lg bg-accent px-5 text-[15.8px] font-semibold text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
            >
              Wallet
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
          
          {/* Dropdown 1 */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          {/* Notifications */}
          <Link href="/notifications" className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </Link>

          {/* User Profile */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}
