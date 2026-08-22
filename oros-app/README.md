# Oros Web

Next.js frontend for Oros prediction markets.

## Architecture

- `app/` App Router pages and API routes
- `components/` UI, layout, market, wallet, and notification components
- `hooks/` client hooks for wallet, markets, matches, and transactions
- `lib/` API, Supabase, web3, constants, and helpers
- `stores/` lightweight in-memory client stores
- `types/` shared app types

## Auth model

This frontend uses **soft auth**:
- public pages are browseable without blocking on login
- `/login` exists for optional magic-link auth
- wallet connection is optional until trading actions require it

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:4001
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_OROS_TOKEN_ADDRESS=
NEXT_PUBLIC_OROS_MARKET_ADDRESS=
```

## Run

```bash
npm install
npm run dev
```

## Notes

- The frontend now consumes the Express backend at `NEXT_PUBLIC_BACKEND_URL` for matches, match details, markets, user positions, portfolio, and faucet claims.
- Where the backend still returns placeholder or incomplete data, the frontend normalizes responses and falls back gracefully.
- Supabase helpers are intentionally soft placeholders until real project keys are added.
- Wallet flow is UI-first and ready for wagmi/viem integration.
