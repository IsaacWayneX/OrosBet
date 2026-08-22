"use client";

import { useMemo, useState } from "react";
import { getWalletState, setWalletState } from "@/stores/wallet.store";

export function useWallet() {
  const [state, setState] = useState(getWalletState());

  const actions = useMemo(
    () => ({
      connect() {
        const next = setWalletState({
          connected: true,
          address: "0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f",
          balance: 1000,
        });
        setState(next);
      },
      disconnect() {
        const next = setWalletState({ connected: false, address: null, balance: 0 });
        setState(next);
      },
    }),
    []
  );

  return { ...state, ...actions };
}
