import { createPublicClient, createWalletClient, custom, http } from "viem";

const chainId = Number(process.env.NEXT_PUBLIC_MONAD_CHAIN_ID || 10143);
const rpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz";

export const monadChain = {
  id: chainId,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
    public: {
      http: [rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://monad-testnet.blockscout.com",
    },
  },
};

export const publicClient = createPublicClient({
  chain: monadChain,
  transport: http(rpcUrl),
});

export function getWalletClient() {
  if (typeof window === "undefined") {
    throw new Error("Wallet client only available in browser");
  }

  const provider = (window as any).ethereum;
  if (!provider) {
    throw new Error("MetaMask not detected");
  }

  return createWalletClient({
    chain: monadChain,
    transport: custom(provider),
  });
}
