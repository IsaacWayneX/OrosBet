# Oros: Live Sports Prediction Markets

A real-time decentralized prediction market platform for sports betting using an Automated Market Maker (AMM) model with dynamically generated markets powered by live game data.

---

## 📋 Overview

**Oros** is a prediction market platform where users can place bets on real-time sports events using binary (Yes/No) outcomes. The platform features:

- **Live Action Markets** - 8 rotating real-time markets that expire in 10s, 15s, or 30s
- **Dynamic Market Generation** - Markets automatically created based on match progression and minute counters
- **Wallet-Only Authentication** - Connect with your Web3 wallet, no email/password needed
- **Constant Product Market Maker (CPMM)** - AMM formula for pricing and liquidity
- **Monad Testnet** - Fast, low-cost transactions on the Monad blockchain

---

## 🏗️ Architecture

### Three-Layer Stack

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Next.js 16 + React 19 + Tailwind CSS)    │
│  - Live match display with real-time updates        │
│  - Real-time action markets (8-market carousel)     │
│  - Wallet connection & faucet claims                │
│  - Positions tracking & activity feed               │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│  Backend (Express.js + TypeScript + Viem)           │
│  - LiveGames API (live/upcoming match data)          │
│  - Markets API (market creation & resolution)       │
│  - User positions & portfolio endpoints             │
│  - Faucet for testnet token distribution            │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│  Smart Contracts (Solidity on Monad Testnet)        │
│  - OrosUSD (ERC-20 token)                           │
│  - OrosMarket (Prediction market AMM)               │
│  - Market resolution & settlement logic             │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Frontend

**Location:** `/oros-app`

### Pages

| Page | Route | Purpose |
|------|-------|---------|
| **Live Events** | `/activity` | Shows live matches with real-time action markets |
| **Starting Soon** | `/upcoming` | Displays upcoming matches |
| **My Positions** | `/positions` | User's active bets and positions |
| **Activity** | `/notifications` | Transaction history and wallet actions |

### Key Components

- **LiveMatchCard** - Displays match info: teams, score, league, minute
- **LiveInteractiveMarkets** - 8 rotating markets with YES/NO buttons
- **SportsHero** - Top navigation showing 7 sports categories
- **Navbar** - Wallet connection, balance display, faucet button
- **Sidebar** - Navigation with active page indicator

### Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Viem (blockchain interaction)
- TypeScript

---

## 🔧 Backend

**Location:** `/oros`

### API Endpoints

#### Live Games
- `GET /api/v1/livegames` - Current live matches
- `GET /api/v1/livegames/upcoming` - Upcoming fixtures
- `GET /api/v1/livegames/:matchId` - Match details with events

#### Markets
- `GET /api/v1/markets` - All available markets
- `GET /api/v1/markets/:marketId` - Market details
- `POST /api/v1/markets` - Create new market
- `POST /api/v1/markets/:marketId/resolve` - Resolve market outcome

#### User
- `GET /api/v1/user/positions` - User positions
- `GET /api/v1/user/portfolio` - Portfolio summary

#### Faucet
- `POST /api/v1/faucet/claim` - Claim testnet tokens

### Tech Stack

- Express.js
- TypeScript
- Prisma (database ORM)
- Viem (blockchain SDK)
- Axios (HTTP client)

---

## 🔮 Live LLM-Generated Markets

### How It Works

Markets are **dynamically generated based on match progression** and rotate automatically:

#### Market Types (8 Total)

1. **Next Goal** - Who will score next? (30s/15s/10s)
2. **Next Corner** - Which team gets the next corner? (30s/15s/10s)
3. **Yellow Card** - Next yellow card to which team? (30s/15s/10s)
4. **Possession** - Will home team have more possession? (30s/15s/10s)
5. **Shots on Target** - Next shot on target from? (30s/15s/10s)
6. **Next Offside** - Next offside against which team? (30s/15s/10s)
7. **Next Foul** - Foul committed by which team? (30s/15s/10s)
8. **Next Throw-in** - Throw-in to which team? (30s/15s/10s)

#### Market Lifecycle

```
Match Minute 0'
    ↓
Market 1 Created (30s/15s/10s TTL)
    ↓
Market 1 Expires → Market 2 Generated
    ↓
Users Place Bets During Live Trading
    ↓
Market Expires → Automatically Resolved
    ↓
Next Market Replaces It
```

#### Generation Logic

- **Template Selection** - Cycles through 8 market templates
- **Random Duration** - Each market gets 30s, 15s, or 10s TTL at random
- **Dynamic Odds** - Probabilities and prices generated from match state
- **Real-Time Updates** - Markets refresh every 5 seconds
- **Auto-Rotation** - When market expires, new market fills slot

#### Key Features

✅ **Always 8 Markets Active** - Continuous carousel of betting opportunities  
✅ **Fast TTL** - 10s/15s/30s expirations encourage quick decision-making  
✅ **Smart Seeding** - Odds derived from match minute and game state  
✅ **Infinite Supply** - Markets continuously generated throughout match  
✅ **Low Friction** - One-click betting with pre-set amounts  

---

## 💰 Smart Contracts

**Location:** `/contracts`

### OrosUSD (ERC-20)

```solidity
- mint(address to, uint256 amount) - Admin minting
- burn(uint256 amount) - User token burning
- burnFrom(address account, uint256 amount) - Burn from allowance
```

### OrosMarket (Prediction Market AMM)

```solidity
- createMarket(description, outcomes, deadline, initialLiquidity)
- buyShares(marketId, outcomeId, tokenAmount) - Place bet
- sellShares(marketId, outcomeId, shares) - Exit position
- resolveMarket(marketId, correctOutcome) - Settle market
- claimWinnings(marketId) - Claim profit from resolved market
```

**Formula:** Constant Product Market Maker (CPMM)
```
k = liquidityA × liquidityB (constant)
price = liquidityA / liquidityB
```

---

## 🚀 Deployment

### Network
- **Chain:** Monad Testnet
- **Network ID:** 10143
- **RPC:** `https://testnet-rpc.monad.xyz`

### Deployed Addresses
- **OrosUSD:** (Deployed via script)
- **OrosMarket:** (Deployed via script)

### Local Development

```bash
# Backend
cd oros
npm install
npm run dev

# Frontend
cd oros-app
npm install
npm run dev

# Contracts
cd contracts
npm install
npm run compile
npm run deploy
```

---

## 🔄 User Flow

### Step 1: Connect Wallet
- User opens app
- Clicks "Wallet" button
- Connects MetaMask/Web3 wallet
- Wallet balance displays

### Step 2: Get Testnet Tokens
- Clicks "Mint 1000 OUSD (Faucet)"
- Receives 1000 test tokens
- Balance updates

### Step 3: Browse Markets
- Navigates to `/activity` (Live Events)
- Sees live matches and real-time markets
- Markets display with countdown timers

### Step 4: Place Bet
- Clicks GREEN button for YES
- Clicks RED button for NO
- Selects bet amount
- Transaction processed
- Activity modal shows confirmation

### Step 5: Track Position
- Goes to `/positions`
- Views all active bets
- Sees P&L calculations
- Can exit early or hold until resolution

---

## 🎨 UI/UX Highlights

- **Clean White Theme** - Minimal, professional aesthetic
- **Real-time Updates** - Live data refreshes seamlessly
- **No Shadows** - Flat design for clarity
- **Green/Red CTAs** - Intuitive YES/NO button colors
- **Sport Cards Hero** - 7 sports categories at page top
- **Loading Skeletons** - Smooth skeleton screens while loading
- **Activity Modal** - Transaction feedback with status updates

---

## 📊 Data Model

### Match
```typescript
{
  id: string
  homeTeam: string
  awayTeam: string
  status: "live" | "scheduled" | "finished"
  homeScore: number
  awayScore: number
  minute: number | null
  league: string
  events: Event[]
}
```

### Market
```typescript
{
  id: string
  matchId: string
  title: string
  description: string
  outcomeYesPrice: number
  outcomeNoPrice: number
  probabilityYes: number
  probabilityNo: number
  volume: number
  liquidity: number
  status: "open" | "resolved" | "closed"
  resolutionDeadline: string
}
```

### Position
```typescript
{
  id: string
  marketId: string
  side: "yes" | "no"
  shares: number
  tokenAmount: number
  avgPrice: number
  pnl: number
  status: "active" | "resolved"
}
```

---

## 🔐 Security & Features

✅ **Wallet-Only Auth** - No centralized user database  
✅ **Reentrancy Guard** - Protected against reentrancy attacks  
✅ **Owner Controls** - Market creation requires admin  
✅ **Resolution Deadline** - Markets must resolve within timeframe  
✅ **Graceful Fallbacks** - App works with mock data if API unavailable  

---

## 🛣️ Roadmap

- [ ] Limit Order Book integration
- [ ] Cross-chain settlement
- [ ] Advanced charting tools
- [ ] Leaderboards & rewards
- [ ] Mobile app (React Native)
- [ ] Governance token (ORO)
- [ ] Real sports data oracle

---

## 📚 Resources

- **Monad Testnet:** https://monad-testnet.blockscout.com
- **Viem Docs:** https://viem.sh
- **Next.js Docs:** https://nextjs.org/docs
- **Solidity Docs:** https://docs.soliditylang.org

---

## 📝 License

MIT

---

**Built with ❤️ on Monad Testnet**
