import { MONAD_CHAIN } from "@/lib/constants";

export function getViemConfig() {
  return {
    chainId: MONAD_CHAIN.id,
    transport: MONAD_CHAIN.rpcUrl,
  };
}
