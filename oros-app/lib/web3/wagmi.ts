import { monadTestnet } from "./chains";

export function getWagmiConfig() {
  return {
    appName: "Oros Web",
    chains: [monadTestnet],
  };
}
