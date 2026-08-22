"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency, shortenAddress } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";

export function WalletBalance() {
  const wallet = useWallet();

  return (
    <Card>
      <p className="text-sm text-slate-400">Wallet</p>
      <h3 className="mt-2 text-xl font-semibold">{shortenAddress(wallet.address)}</h3>
      <p className="mt-3 text-sm text-slate-300">Balance: {formatCurrency(wallet.balance)}</p>
      <p className="mt-1 text-xs text-slate-500">Chain: {wallet.chainName}</p>
    </Card>
  );
}
