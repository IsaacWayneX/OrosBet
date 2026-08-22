"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { claimFaucet } from "@/lib/api";

export function FaucetClaim() {
  const [address, setAddress] = useState("0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onClaim() {
    try {
      setLoading(true);
      const result = await claimFaucet(address);
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to claim faucet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h3 className="font-semibold">Faucet</h3>
      <p className="mt-2 text-sm text-slate-400">Claim test OUSD from the backend faucet endpoint.</p>
      <div className="mt-4 space-y-3">
        <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x..." />
        <Button onClick={onClaim} disabled={loading} className="w-full">
          {loading ? "Claiming..." : "Claim faucet"}
        </Button>
        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </div>
    </Card>
  );
}
