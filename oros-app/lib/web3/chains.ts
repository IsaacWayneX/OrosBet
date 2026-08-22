import { MONAD_CHAIN } from "@/lib/constants";

export const monadTestnet = {
  id: MONAD_CHAIN.id,
  name: MONAD_CHAIN.name,
  rpcUrls: {
    default: {
      http: [MONAD_CHAIN.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: MONAD_CHAIN.blockExplorer,
    },
  },
};
