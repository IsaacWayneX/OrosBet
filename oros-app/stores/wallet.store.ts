import type { WalletState } from "@/types";

let walletState: WalletState = {
  address: null,
  connected: false,
  balance: 0,
  chainName: "Monad Testnet",
};

export function getWalletState() {
  return walletState;
}

export function setWalletState(next: Partial<WalletState>) {
  walletState = { ...walletState, ...next };
  return walletState;
}
