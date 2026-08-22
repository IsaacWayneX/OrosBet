"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { setWalletState } from "@/stores/wallet.store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Play, Timer, Sparkles, CheckCircle2 } from "lucide-react";

interface OutcomeOption {
  label: string;
  odds: number;
}

interface AutoMarket {
  id: string;
  title: string;
  timeLeft: number;
  totalTime: 10 | 30 | 60;
  options: OutcomeOption[];
  status: "active" | "expired" | "resolved";
  resolvedOutcome?: string;
}

interface LiveInteractiveMarketsProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

export function LiveInteractiveMarkets({ matchId, homeTeam, awayTeam }: LiveInteractiveMarketsProps) {
  const wallet = useWallet();
  const [markets, setMarkets] = useState<AutoMarket[]>([]);
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<AutoMarket | null>(null);
  const [selectedOption, setSelectedOption] = useState<OutcomeOption | null>(null);
  const [betAmount, setBetAmount] = useState<number>(50);
  const [betSuccess, setBetSuccess] = useState(false);
  
  // Initialize with some default fast-paced markets
  useEffect(() => {
    const initialMarkets: AutoMarket[] = [
      {
        id: `auto-1-${Date.now()}`,
        title: "Foul in the next 10 seconds",
        timeLeft: 10,
        totalTime: 10,
        options: [
          { label: "Yes", odds: 2.45 },
          { label: "No", odds: 1.55 }
        ],
        status: "active"
      },
      {
        id: `auto-2-${Date.now()}`,
        title: "Corner Kick in the next 30 seconds",
        timeLeft: 30,
        totalTime: 30,
        options: [
          { label: "Yes", odds: 1.85 },
          { label: "No", odds: 1.95 }
        ],
        status: "active"
      },
      {
        id: `auto-3-${Date.now()}`,
        title: "Next Goal Scored",
        timeLeft: 60,
        totalTime: 60,
        options: [
          { label: homeTeam, odds: 3.30 },
          { label: "No Goal", odds: 5.60 },
          { label: awayTeam, odds: 1.20 }
        ],
        status: "active"
      }
    ];
    setMarkets(initialMarkets);
  }, [homeTeam, awayTeam]);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prevMarkets) =>
        prevMarkets.map((market) => {
          if (market.status !== "active") return market;
          
          const newTimeLeft = market.timeLeft - 1;
          if (newTimeLeft <= 0) {
            // Randomly resolve the market for interactive feel
            const randomIndex = Math.floor(Math.random() * market.options.length);
            const resolvedOutcome = market.options[randomIndex].label;
            return {
              ...market,
              timeLeft: 0,
              status: "resolved",
              resolvedOutcome
            };
          }
          return { ...market, timeLeft: newTimeLeft };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Periodic market generator
  useEffect(() => {
    const marketTemplates = [
      {
        title: "Shot on Target in the next 30 seconds",
        totalTime: 30 as const,
        options: [
          { label: "Yes", odds: 2.10 },
          { label: "No", odds: 1.70 }
        ]
      },
      {
        title: "Yellow Card in the next 60 seconds",
        totalTime: 60 as const,
        options: [
          { label: "Yes", odds: 4.50 },
          { label: "No", odds: 1.15 }
        ]
      },
      {
        title: "Free Kick Awarded in the next 10 seconds",
        totalTime: 10 as const,
        options: [
          { label: "Yes", odds: 3.10 },
          { label: "No", odds: 1.35 }
        ]
      },
      {
        title: "Throw-in in the next 10 seconds",
        totalTime: 10 as const,
        options: [
          { label: "Yes", odds: 1.50 },
          { label: "No", odds: 2.50 }
        ]
      }
    ];

    const generator = setInterval(() => {
      const template = marketTemplates[Math.floor(Math.random() * marketTemplates.length)];
      const newMarket: AutoMarket = {
        id: `auto-gen-${Date.now()}`,
        title: template.title,
        timeLeft: template.totalTime,
        totalTime: template.totalTime,
        options: template.options,
        status: "active"
      };

      setMarkets((prev) => {
        // Keep maximum 4 active/recent markets
        const activeOrRecent = prev.filter(m => m.status === "active" || (m.status === "resolved" && Date.now() - parseInt(m.id.split("-")[2]) < 10000));
        return [newMarket, ...activeOrRecent].slice(0, 4);
      });
    }, 15000);

    return () => clearInterval(generator);
  }, []);

  const handlePlaceBetClick = (market: AutoMarket, option: OutcomeOption) => {
    if (!wallet.connected) {
      wallet.connect();
      return;
    }
    setSelectedMarket(market);
    setSelectedOption(option);
    setBetSuccess(false);
    setBetModalOpen(true);
  };

  const executeBet = () => {
    if (!wallet.connected || !selectedOption || wallet.balance < betAmount) return;

    // Deduct balance from store
    const nextBalance = wallet.balance - betAmount;
    setWalletState({ balance: nextBalance });
    
    setBetSuccess(true);
    setTimeout(() => {
      setBetModalOpen(false);
      setBetSuccess(false);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-secondary" />
          <span>Real-time Action Markets</span>
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Auto-generating every 15s
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {markets.map((market) => (
          <div
            key={market.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "0px",
              isolation: "isolate",
              background: "#213545",
              borderRadius: "8px",
              border: "1px solid rgba(62, 88, 108, 0.2)"
            }}
            className="w-full transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Header Container */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                height: "48px",
                borderRadius: "8px 8px 0px 0px"
              }}
              className="w-full border-b border-[#3E586C]/10"
            >
              <div className="flex flex-col items-start justify-center flex-1">
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "14.8px",
                    lineHeight: "24px",
                    color: "#ECF3F9"
                  }}
                  className="truncate max-w-[280px]"
                >
                  {market.title}
                </span>
              </div>
              
              {/* Timer/Status Badge */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 text-xs font-semibold">
                <Timer className="h-3.5 w-3.5 text-accent-secondary" />
                {market.status === "active" ? (
                  <span className="text-[#ECF3F9] font-mono">{market.timeLeft}s</span>
                ) : market.status === "resolved" ? (
                  <span className="text-emerald-400 uppercase text-[10px]">Settled: {market.resolvedOutcome}</span>
                ) : (
                  <span className="text-rose-400 uppercase text-[10px]">Expired</span>
                )}
              </div>
            </div>

            {/* Odds Button Container */}
            <div
              style={{
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                background: "#213545",
                borderTop: "1px solid #3E586C",
                borderRadius: "0px 0px 8px 8px"
              }}
              className="w-full"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "12px 16px",
                  gap: "8px"
                }}
                className="w-full"
              >
                {market.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => market.status === "active" && handlePlaceBetClick(market, option)}
                    disabled={market.status !== "active"}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "rgba(0, 0, 0, 0.3)",
                      borderRadius: "8px",
                      flex: 1
                    }}
                    className="h-10 hover:bg-black/50 transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 400,
                          fontSize: "13px",
                          lineHeight: "20px",
                          color: "#ECF3F9"
                        }}
                        className="truncate group-hover:text-white"
                      >
                        {option.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 600,
                          fontSize: "13.5px",
                          lineHeight: "20px",
                          color: "#5BAEFF"
                        }}
                      >
                        {option.odds.toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Place Bet Modal */}
      {selectedMarket && selectedOption && (
        <Modal open={betModalOpen} onClose={() => setBetModalOpen(false)} title="Place Action Bet">
          {betSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-white">Bet Placed Successfully!</h4>
              <p className="text-sm text-slate-400">
                Your prediction for <span className="text-[#5BAEFF] font-semibold">{selectedOption.label}</span> has been logged.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Market</p>
                <p className="text-sm font-semibold text-white mt-0.5">{selectedMarket.title}</p>
              </div>

              <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-slate-400">Selection</p>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedOption.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Odds</p>
                  <p className="text-sm font-bold text-[#5BAEFF] mt-0.5">{selectedOption.odds.toFixed(2)}x</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400">Bet Amount (OUSD)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 50, 100, 250].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBetAmount(amt)}
                      className={`h-9 rounded-lg font-semibold text-xs border ${
                        betAmount === amt
                          ? "bg-accent border-accent text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-slate-400">Potential Return</span>
                <span className="font-bold text-emerald-400">{(betAmount * selectedOption.odds).toFixed(2)} OUSD</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={() => setBetModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={executeBet} disabled={wallet.balance < betAmount} className="flex-1">
                  Confirm Bet
                </Button>
              </div>
              {wallet.balance < betAmount && (
                <p className="text-xs text-center text-rose-400 mt-1">Insufficient OUSD balance.</p>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
