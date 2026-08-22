"use client";

import { useMemo, useState, useEffect } from "react";
import { formatEther, parseEther } from "viem";
import { getWalletState, setWalletState } from "@/stores/wallet.store";
import { publicClient, getWalletClient, monadChain } from "@/lib/web3/viem";
import { OROS_TOKEN_ADDRESS, OrosTokenAbi } from "@/lib/web3/contracts";

export function useWallet() {
  const [state, setState] = useState(getWalletState());

  // Listen to Metamask events and perform eager connection check on mount
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const provider = (window as any).ethereum;
      
      const handleAccounts = async (accounts: string[]) => {
        if (accounts.length === 0) {
          const next = setWalletState({ connected: false, address: null, balance: 0 });
          setState(next);
        } else {
          const address = accounts[0];
          try {
            const balanceWei = await publicClient.readContract({
              address: OROS_TOKEN_ADDRESS,
              abi: OrosTokenAbi,
              functionName: "balanceOf",
              args: [address as `0x${string}`],
            });
            const balance = Number(formatEther(balanceWei));
            const next = setWalletState({ connected: true, address, balance });
            setState(next);
          } catch (e) {
            console.error("Error reading token balance on account change:", e);
          }
        }
      };

      // Eager check on load
      provider.request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            handleAccounts(accounts);
          }
        })
        .catch((err: any) => console.error("Eager connection check failed:", err));

      provider.on("accountsChanged", handleAccounts);
      return () => {
        provider.removeListener("accountsChanged", handleAccounts);
      };
    }
  }, []);

  const actions = useMemo(
    () => ({
      async connect() {
        if (typeof window !== "undefined" && (window as any).ethereum) {
          try {
            const provider = (window as any).ethereum;
            
            // Force Metamask permission popup to show account selection
            await provider.request({
              method: "wallet_requestPermissions",
              params: [{ eth_accounts: {} }],
            });

            const accounts = await provider.request({ method: "eth_requestAccounts" });
            const address = accounts[0];
            
            let balance = 0;
            try {
              const balanceWei = await publicClient.readContract({
                address: OROS_TOKEN_ADDRESS,
                abi: OrosTokenAbi,
                functionName: "balanceOf",
                args: [address as `0x${string}`],
              });
              balance = Number(formatEther(balanceWei));
            } catch (e) {
              console.error("Error reading token balance:", e);
            }

            const next = setWalletState({
              connected: true,
              address: address,
              balance: balance,
            });
            setState(next);
          } catch (err) {
            console.error("Metamask connection failed:", err);
          }
        } else {
          // Fallback to mock account
          const next = setWalletState({
            connected: true,
            address: "0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f",
            balance: 1000,
          });
          setState(next);
        }
      },
      disconnect() {
        const next = setWalletState({ connected: false, address: null, balance: 0 });
        setState(next);
      },
      async claimTokens() {
        const current = getWalletState();
        if (!current.address) return;

        if (current.address === "0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f") {
          const next = setWalletState({
            balance: current.balance + 1000,
          });
          setState(next);
          return "mock-hash-" + Date.now();
        }

        try {
          const walletClient = getWalletClient();
          const hash = await walletClient.writeContract({
            chain: monadChain,
            account: current.address as `0x${string}`,
            address: OROS_TOKEN_ADDRESS,
            abi: OrosTokenAbi,
            functionName: "mint",
            args: [current.address as `0x${string}`, parseEther("1000")],
          });

          await publicClient.waitForTransactionReceipt({ hash });

          const balanceWei = await publicClient.readContract({
            address: OROS_TOKEN_ADDRESS,
            abi: OrosTokenAbi,
            functionName: "balanceOf",
            args: [current.address as `0x${string}`],
          });
          const balance = Number(formatEther(balanceWei));
          
          const next = setWalletState({ balance });
          setState(next);
          return hash;
        } catch (e) {
          console.error("Metamask mint transaction failed:", e);
          throw e;
        }
      }
    }),
    []
  );

  return { ...state, ...actions };
}
