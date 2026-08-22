import dotenv from "dotenv";

dotenv.config();

export const env = {
  // Server
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4001", 10),

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,

  // Sports API
  sportsMode: (process.env.SPORTS_MODE || "file") as "file" | "mock" | "real",
  sportsApiKey: process.env.SPORTS_API_KEY,

  // Blockchain
  monadRpcUrl: process.env.MONAD_RPC_URL || "https://testnet-rpc.monad.xyz/",
  orosTokenAddress: process.env.OROS_TOKEN_ADDRESS,
  orosMarketAddress: process.env.OROS_MARKET_ADDRESS,
  resolverPrivateKey: process.env.RESOLVER_PRIVATE_KEY,

  // AI
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,

  // Workers
  qstashToken: process.env.QSTASH_TOKEN,
  qstashSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
};

// Validate required environment variables
function validateEnv() {
  const required = [
    "DATABASE_URL",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "MONAD_RPC_URL",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`⚠️  Missing environment variable: ${key}`);
    }
  }
}

validateEnv();
