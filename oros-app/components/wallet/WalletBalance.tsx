"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency, shortenAddress } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";

export function WalletBalance() {
  const wallet = useWallet();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Wallet Address</p>
          <h3 className="mt-2 text-xl font-semibold">{shortenAddress(wallet.address)}</h3>
        </div>
        <div className="h-12 w-12 overflow-hidden rounded-full bg-white/5 p-2 flex items-center justify-center border border-white/10">
          <img src="/oros.png" alt="Oros Logo" className="h-full w-full object-contain" />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-300">Balance: {formatCurrency(wallet.balance)}</p>
      <p className="mt-1 text-xs text-slate-500">Chain: {wallet.chainName}</p>
    </Card>
  );
}
