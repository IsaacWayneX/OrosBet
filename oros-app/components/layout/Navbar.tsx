"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { useWallet } from "@/hooks/useWallet";
import { ChevronDown, Search, Menu, Bell, User, Sun, Moon } from "lucide-react";

export function Navbar() {
  const wallet = useWallet();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("oros-theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("oros-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-[60px] w-full items-center justify-center bg-background-elevated border-b border-border/40 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.02)]">
      <div className="flex h-full w-full max-w-[1200px] items-center justify-between px-4 lg:px-6">
        
        {/* Left: Logo/Home */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center transition hover:opacity-80">
            <img src="/oros.png" alt="Oros Logo" className="h-9 w-auto logo-filter" />
          </Link>
        </div>

        {/* Center: Wallet/Currency Controls */}
        <div className="flex h-12 items-center">
          <div className="flex items-center gap-[0.01px]">
            {/* Currency Selector / Balance */}
            <button className="flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-l-lg bg-black/5 dark:bg-black/30 px-5 shadow-inner transition hover:bg-black/10 dark:hover:bg-black/40">
              <span className="text-[15px] font-semibold text-foreground">
                {wallet.connected ? wallet.balance.toFixed(8) : "0.00000000"}
              </span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full overflow-hidden bg-[#1475E1]/10 dark:bg-white/10">
                <img src="/oros.png" alt="Oros Coin" className="h-4 w-4 object-contain logo-filter" />
              </div>
              <ChevronDown size={14} className="text-foreground stroke-[3px]" />
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
          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5 transition"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon size={20} className="text-muted stroke-[2.5px]" />
            ) : (
              <Sun size={20} className="text-muted stroke-[2.5px]" />
            )}
          </button>

          {/* Search */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5">
            <Search size={20} className="text-muted stroke-[2.5px]" />
          </button>
          
          {/* Menu */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5">
            <Menu size={20} className="text-muted stroke-[2.5px]" />
          </button>

          {/* Notifications */}
          <Link href="/notifications" className="flex h-11 w-11 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5">
            <Bell size={20} className="text-muted stroke-[2.5px]" />
          </Link>

          {/* User Profile */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5">
            <User size={20} className="text-muted stroke-[2.5px]" />
          </button>
        </div>

      </div>
    </header>
  );
}
