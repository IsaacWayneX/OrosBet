"use client";

import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { FaucetClaim } from "@/components/wallet/FaucetClaim";
import { PortfolioSummaryCard } from "@/components/wallet/PortfolioSummaryCard";
import { TransactionStatus } from "@/components/wallet/TransactionStatus";
import { WalletBalance } from "@/components/wallet/WalletBalance";
import { Button } from "@/components/ui/Button";
import { useTransaction } from "@/hooks/useTransaction";

export default function WalletPage() {
  const { transaction, begin } = useTransaction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Wallet</h1>
        <p className="mt-2 text-sm text-slate-400">Soft auth means the app stays usable even before connection.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <WalletBalance />
        <div className="surface rounded-2xl p-5">
          <h3 className="font-semibold">Actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <ConnectWallet />
            <Button variant="secondary" onClick={() => begin("Approve OUSD spending")}>Mock approve</Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <PortfolioSummaryCard />
        <FaucetClaim />
      </div>
      <TransactionStatus transaction={transaction} />
    </div>
  );
}
