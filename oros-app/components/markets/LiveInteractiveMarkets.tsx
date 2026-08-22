"use client";

import { useEffect, useState } from "react";
import { getMatch } from "@/lib/api";
import { generateLiveMarkets, getTimeRemainingSeconds } from "@/lib/market-templates";
import type { Match } from "@/types";
import { Card } from "@/components/ui/Card";
import { formatCompactNumber } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { useActivity } from "@/hooks/useActivity";

interface LiveInteractiveMarketsProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

export function LiveInteractiveMarkets({
  matchId,
  homeTeam,
  awayTeam,
}: LiveInteractiveMarketsProps) {
  const [markets, setMarkets] = useState<any[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  const wallet = useWallet();
  const activity = useActivity();

  // Initial load and periodic refresh
  useEffect(() => {
    const loadMarkets = async () => {
      const data = await getMatch(matchId);
      setMatch(data);
      if (data?.status === "live") {
        const liveMarkets = generateLiveMarkets(data);
        setMarkets(liveMarkets);
        
        // Initialize timers
        const timers: Record<string, number> = {};
        liveMarkets.forEach((m: any) => {
          timers[m.id] = getTimeRemainingSeconds(m);
        });
        setTimeRemaining(timers);
      }
    };

    loadMarkets();
    
    // Refresh markets every 5 seconds to check for expirations
    const refreshInterval = setInterval(loadMarkets, 5000);
    return () => clearInterval(refreshInterval);
  }, [matchId]);

  // Countdown timer
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (updated[key] > 0) {
            updated[key]--;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handlePlaceBet = async (market: any, outcome: "yes" | "no") => {
    if (!wallet.connected) {
      wallet.connect();
      return;
    }

    try {
      const amount = 10; // Default bet amount
      const price = outcome === "yes" ? market.outcomeYesPrice : market.outcomeNoPrice;
      
      activity.startActivity("Placing Bet", `Betting ${amount} OUSD on ${outcome.toUpperCase()}...`);
      
      // Simulate bet placement
      // In production, this would call a smart contract or backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      activity.success();
    } catch (error) {
      activity.error(error instanceof Error ? error.message : "Failed to place bet");
    }
  };

  if (!match || match.status !== "live") {
    return null;
  }

  // Filter out expired markets
  const activeMarkets = markets.filter((m: any) => getTimeRemainingSeconds(m) > 0);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Real-time Action Markets</h2>
        <p className="text-sm text-slate-400 mt-1">Markets expire in 10s, 15s, or 30s</p>
      </div>

      {activeMarkets.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-400">Loading live markets...</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {activeMarkets.slice(0, 8).map((market: any) => {
            const timeLeft = timeRemaining[market.id] || 0;
            return (
              <Card key={market.id} className="p-4 border border-neutral-200">
                <div className="space-y-3">
                  {/* Market Title */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                      {market.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Expires in</span>
                      <span className={`text-sm font-bold ${
                        timeLeft <= 5 ? "text-rose-400" : "text-accent"
                      }`}>
                        {timeLeft}s
                      </span>
                    </div>
                  </div>

                  {/* Yes/No Split */}
                  <div className="space-y-2">
                    {/* YES Option */}
                    <button 
                      onClick={() => handlePlaceBet(market, "yes")}
                      disabled={!wallet.connected || timeLeft === 0}
                      className="w-full px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed transition text-white border border-emerald-600"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">YES</span>
                          <span className="text-[10px]">{homeTeam}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {market.probabilityYes}%
                          </div>
                          <div className="text-[10px]">
                            @{market.outcomeYesPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* NO Option */}
                    <button 
                      onClick={() => handlePlaceBet(market, "no")}
                      disabled={!wallet.connected || timeLeft === 0}
                      className="w-full px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/50 disabled:cursor-not-allowed transition text-white border border-rose-600"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">NO</span>
                          <span className="text-[10px]">{awayTeam}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {market.probabilityNo}%
                          </div>
                          <div className="text-[10px]">
                            @{market.outcomeNoPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Volume & Liquidity */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px]">
                    <div>
                      <span className="text-muted">Vol</span>
                      <span className="ml-1 font-semibold text-foreground">
                        {formatCompactNumber(market.volume)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">Liq</span>
                      <span className="ml-1 font-semibold text-foreground">
                        {formatCompactNumber(market.liquidity)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
