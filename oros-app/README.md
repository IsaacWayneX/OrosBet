# Oros Web

Next.js frontend for Oros prediction markets.

## Smart Contracts (Monad Testnet)

- **OROS Token (OUSD)**: [`0x7526632399d62Bd2d9b0Bca4A1513870634Df286`](https://testnet.monadvision.com/token/0x7526632399d62Bd2d9b0Bca4A1513870634Df286)
- **OROS Market (AMM)**: [`0x9B15E03dff92aeCbEe93E03505b8C8932e2A6A87`](https://testnet.monadvision.com/address/0x9B15E03dff92aeCbEe93E03505b8C8932e2A6A87)

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

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_MONAD_RPC_URL`, and keys above.

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
