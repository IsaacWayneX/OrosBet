"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { useWallet } from "@/hooks/useWallet";
import { ChevronDown, Search, Menu, Bell, User } from "lucide-react";

export function Navbar() {
  const wallet = useWallet();

  return (
    <header className="sticky top-0 z-50 flex h-[60px] w-full items-center justify-center bg-[#0E202D] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-1px_rgba(0,0,0,0.12)]">
      <div className="flex h-full w-full max-w-[1200px] items-center justify-between px-4 lg:px-6">
        
        {/* Left: Logo/Home */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center transition hover:opacity-80">
            <img src="/oros.png" alt="Oros Logo" className="h-9 w-auto brightness-0 invert" />
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
              <div className="flex h-5 w-5 items-center justify-center rounded-full overflow-hidden bg-white/10">
                <img src="/oros.png" alt="Oros Coin" className="h-4 w-4 object-contain" />
              </div>
              <ChevronDown size={14} className="text-white stroke-[3px]" />
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
            <Search size={20} className="text-muted stroke-[2.5px]" />
          </button>
          
          {/* Menu */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/5">
            <Menu size={20} className="text-muted stroke-[2.5px]" />
          </button>

          {/* Notifications */}
          <Link href="/notifications" className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/5">
            <Bell size={20} className="text-muted stroke-[2.5px]" />
          </Link>

          {/* User Profile */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/5">
            <User size={20} className="text-muted stroke-[2.5px]" />
          </button>
        </div>

      </div>
    </header>
  );
}
