"use client";

import { Button } from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";

export function ConnectWallet() {
  const wallet = useWallet();
  return wallet.connected ? (
    <Button variant="secondary" onClick={wallet.disconnect}>Disconnect wallet</Button>
  ) : (
    <Button onClick={wallet.connect}>Connect wallet</Button>
  );
}
