# Oros Backend

Node.js/Express backend for Oros prediction market platform.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
cd oros
pnpm install
```

### Environment Setup

```bash
# Copy example env
cp .env.example .env

# Update .env with:
# - Database URL (shared Supabase)
# - Supabase credentials
# - Monad RPC URL
# - Sports API key (if using real mode)
# - Contract addresses (after deployment)
```

### Running

```bash
# Development
pnpm run dev

# Production build
pnpm run build
pnpm start

# Type checking
pnpm run type-check
```

Server starts on `http://localhost:4001`

## API Endpoints

### Health
- `GET /health` - Health check

### Sports Data
- `GET /api/v1/livegames` - Fetch live games
- `GET /api/v1/livegames/:matchId` - Match details + events
- `GET /api/v1/livegames/upcoming` - Upcoming fixtures
- `GET /api/v1/fixtures-by-league/leagues` - Available leagues
- `GET /api/v1/fixtures-by-league/date/:date` - Fixtures by date + leagues

### Markets
- `GET /api/v1/markets` - List markets
- `POST /api/v1/markets` - Create market
- `GET /api/v1/markets/:marketId` - Market details
- `POST /api/v1/markets/:marketId/resolve` - Resolve market

### User/Portfolio
- `GET /api/v1/user/me` - Current user
- `GET /api/v1/user/positions` - User positions
- `GET /api/v1/user/portfolio` - Portfolio summary

### Faucet
- `POST /api/v1/faucet/claim` - Claim OUSD tokens

## Project Structure

```
src/
├── config/env.ts          # Environment variables
├── app.ts                 # Express app setup
├── server.ts              # Server entry point
├── middleware/            # Auth, error handling
├── controllers/           # Route handlers (TBD)
├── routes/                # API routes
│   ├── health.routes.ts
│   ├── livegames.routes.ts
│   ├── markets.routes.ts
│   ├── user.routes.ts
│   └── faucet.routes.ts
├── services/              # Business logic
│   ├── sports/            # Sportmonks integration
│   ├── blockchain/        # Smart contract calls
│   ├── markets/           # Market logic
│   └── resolution/        # Market settlement
└── workers/               # QStash workers

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Database seeding
```

## Database

Uses shared Supabase Postgres instance with Pulse.

**Connection**: Via `DATABASE_URL` environment variable

**Tables** (to be created):
- `users` - User accounts
- `markets` - Prediction markets
- `positions` - User positions
- `events` - Sports events
- `contracts` - Smart contract addresses

## Sports Integration

Supports three provider modes:

1. **file** (default) - Demo mode with hardcoded fixtures
2. **mock** - Golden script with deterministic events
3. **real** - Live Sportmonks API (requires `SPORTS_API_KEY`)

Set via `SPORTS_MODE` environment variable.

## Blockchain

### Configuration

```env
MONAD_RPC_URL=https://testnet-rpc.monad.xyz/
OROS_TOKEN_ADDRESS=0x...
OROS_MARKET_ADDRESS=0x...
RESOLVER_PRIVATE_KEY=0x...
```

### Contract Interaction

Uses Viem for contract reads/writes:
- `createMarket()` - Create new market
- `buyShares()` - Place bet
- `sellShares()` - Exit position
- `resolveMarket()` - Resolve market
- `claimWinnings()` - Claim profits

## Development

### Adding New Endpoint

1. Create route file: `src/routes/new.routes.ts`
2. Implement route handlers
3. Add to `src/app.ts`
4. Update this README

### Adding New Service

1. Create service file: `src/services/new/service.ts`
2. Implement class with methods
3. Export singleton instance
4. Import in routes/controllers

## Testing

```bash
# Unit tests (TBD)
pnpm run test

# Integration tests (TBD)
pnpm run test:integration
```

## Deployment

```bash
# Build
pnpm run build

# Start production
NODE_ENV=production pnpm start
```

## Troubleshooting

**Port already in use**:
```bash
lsof -i :4001
kill -9 <PID>
```

**Database connection failed**:
- Check `DATABASE_URL` in .env
- Verify network access to Supabase

**Contract calls failing**:
- Verify contract addresses in .env
- Check Monad RPC connectivity

## Architecture Diagram

```
┌─────────────────────┐
│   Frontend (Next)   │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│  Express Server     │
│ (this backend)      │
└──────────┬──────────┘
           │
      ┌────┴────┐
      ▼         ▼
   ┌───────┐  ┌──────────────┐
   │ Sports│  │  Blockchain  │
   │  API  │  │   (Monad)    │
   └───────┘  └──────────────┘
      ▲              ▲
      │              │
   Sportmonks    Smart Contracts
     (Real)       (OrosUSD, OrosMarket)
```

## Next Steps

1. Setup database schema (Prisma)
2. Implement sports provider
3. Implement blockchain service
4. Implement route handlers
5. Deploy contracts
6. E2E testing
