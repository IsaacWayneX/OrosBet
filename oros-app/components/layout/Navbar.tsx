"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { useWallet } from "@/hooks/useWallet";
import { ChevronDown, Search, User, Sun, Moon, Copy, LogOut, Coins } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state with url parameter
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(window.location.search);
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    const targetPath = pathname.startsWith("/matches") ? pathname : "/matches";
    router.replace(`${targetPath}?${params.toString()}`);
  };

  return (
    <div className="hidden md:flex items-center relative w-72 h-10 bg-white dark:bg-slate-900 border border-[#E5E5E5] dark:border-slate-800 rounded-xl focus-within:border-accent/70 transition-colors">
      <div className="pl-3 flex items-center justify-center pointer-events-none">
        <Search className="w-4 h-4 text-[#737373]" />
      </div>
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search matches..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full h-full bg-transparent pl-2.5 pr-14 text-sm text-[#171717] dark:text-white focus:outline-none placeholder-[#A1A1A1] cursor-text"
      />
      <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
        <kbd className="w-[22px] h-5 bg-[#FAFAFA] dark:bg-slate-800 border border-[#E5E5E5] dark:border-slate-700 rounded flex items-center justify-center text-[10px] font-semibold text-[#525252] dark:text-slate-400 font-sans">
          ⌘
        </kbd>
        <kbd className="w-5 h-5 bg-[#FAFAFA] dark:bg-slate-800 border border-[#E5E5E5] dark:border-slate-700 rounded flex items-center justify-center text-[10px] font-semibold text-[#525252] dark:text-slate-400 font-sans">
          K
        </kbd>
      </div>
    </div>
  );
}

export function Navbar() {
  const wallet = useWallet();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [txHistory, setTxHistory] = useState<{hash: string; amount: number; time: string}[]>([]);
  const walletDropdownRef = useRef<HTMLDivElement>(null);

  // Load transaction history and handle click outside
  useEffect(() => {
    const saved = localStorage.getItem("oros-tx-history");
    if (saved) {
      try {
        setTxHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
        setWalletModalOpen(false);
      }
    }
    if (walletModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [walletModalOpen]);

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMint = async () => {
    setIsMinting(true);
    try {
      const hash = await wallet.claimTokens();
      if (hash) {
        const newTx = {
          hash,
          amount: 1000,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const updated = [newTx, ...txHistory].slice(0, 5);
        setTxHistory(updated);
        localStorage.setItem("oros-tx-history", JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsMinting(false);
    }
  };

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
    <header className="sticky top-0 z-30 flex h-[60px] w-full items-center justify-center bg-background-elevated border-b border-border/40 lg:pl-[260px]">
      <div className="flex h-full w-full max-w-[1200px] items-center justify-between px-4 lg:px-6">
        
        {/* Left: Search Input */}
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="w-72 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Center: Wallet/Currency Controls */}
        <div className="relative flex h-12 items-center" ref={walletDropdownRef}>
          <div className="flex items-center gap-[0.01px]">
            {/* Currency Selector / Balance */}
            <button 
              onClick={wallet.connected ? () => setWalletModalOpen(!walletModalOpen) : wallet.connect}
              className="flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-l-lg bg-black/5 dark:bg-black/30 px-5 transition hover:bg-black/10 dark:hover:bg-black/40"
            >
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
              onClick={wallet.connected ? () => setWalletModalOpen(!walletModalOpen) : wallet.connect}
              className="flex h-12 items-center justify-center rounded-r-lg bg-accent px-5 text-[15.8px] font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
            >
              Wallet
            </button>
          </div>

          {/* Floating Dropdown attached under the wallet button */}
          {wallet.connected && walletModalOpen && (
            <div className="absolute right-0 top-[52px] z-50 w-80 rounded-xl bg-background-elevated border border-border/60 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground">Wallet Details</h4>
                
                {/* Shortened Address with Copy */}
                <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border/40 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted uppercase font-semibold">Address</p>
                    <p className="text-xs font-mono font-bold truncate max-w-[180px]">
                      {wallet.address ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-8)}` : ""}
                    </p>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition relative"
                  >
                    {copied ? (
                      <span className="text-[9px] text-emerald-500 font-bold uppercase absolute -top-4 left-1/2 -translate-x-1/2 bg-card px-1 rounded">
                        Copied
                      </span>
                    ) : null}
                    <Copy size={14} className="text-muted" />
                  </button>
                </div>

                {/* Balance display */}
                <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border/40 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted uppercase font-semibold">Balance</p>
                    <div className="flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-accent" />
                      <span className="text-sm font-bold font-mono">
                        {wallet.balance.toFixed(8)} OUSD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Mint Transactions */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted uppercase font-semibold">Recent Faucet Mints</p>
                  {txHistory.length === 0 ? (
                    <p className="text-xs text-muted italic">No mint transactions in this session.</p>
                  ) : (
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {txHistory.map((tx, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-1.5 rounded bg-black/5 dark:bg-white/5 border border-border/20">
                          <a 
                            href={`https://monad-testnet.blockscout.com/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[#5BAEFF] hover:underline truncate max-w-[120px]"
                            title={tx.hash}
                          >
                            {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                          </a>
                          <span className="font-semibold text-emerald-400">+{tx.amount} OUSD</span>
                          <span className="text-[9px] text-muted">{tx.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-1 border-t border-border/40">
                  <button
                    onClick={handleMint}
                    disabled={isMinting}
                    className="flex h-9 items-center justify-center gap-2 rounded-lg bg-accent text-white font-semibold text-xs hover:opacity-90 transition disabled:opacity-60"
                  >
                    {isMinting ? "Minting OUSD..." : "Mint 1000 OUSD (Faucet)"}
                  </button>

                  <button
                    onClick={() => {
                      wallet.disconnect();
                      setWalletModalOpen(false);
                    }}
                    className="flex h-9 items-center justify-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 font-semibold text-xs hover:bg-rose-500/15 transition"
                  >
                    <LogOut size={12} />
                    Disconnect
                  </button>
                </div>

              </div>
            </div>
          )}
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

          {/* User Profile */}
          <button className="flex h-11 w-11 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5">
            <User size={20} className="text-muted stroke-[2.5px]" />
          </button>
        </div>

      </div>
    </header>
  );
}
