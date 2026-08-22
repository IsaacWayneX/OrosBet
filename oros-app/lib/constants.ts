export const APP_NAME = "Oros Web";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4001";
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const MONAD_CHAIN = {
  id: 10143,
  name: "Monad Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz",
  blockExplorer: "https://monad-testnet.blockscout.com",
};
