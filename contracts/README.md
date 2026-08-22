# Oros Smart Contracts

Solidity smart contracts for Oros prediction market platform built with Foundry.

## Contracts

### 1. OrosUSD (OUSD)
ERC-20 token contract for betting and liquidity provision.

**Key Functions**:
- `mint(to, amount)` - Mint tokens (owner only)
- `burn(amount)` - Burn tokens from caller
- `burnFrom(account, amount)` - Burn tokens from another address
- Standard ERC-20 functions (transfer, approve, etc.)

### 2. OrosMarket
Prediction market AMM using Constant Product Market Maker formula.

**Key Functions**:
- `createMarket(description, outcomes, deadline, liquidity)` - Create new market
- `buyShares(marketId, outcomeId, amount)` - Place bet (buy shares)
- `sellShares(marketId, outcomeId, shares)` - Exit position (sell shares)
- `resolveMarket(marketId, correctOutcome)` - Resolve market (owner only)
- `claimWinnings(marketId)` - Claim profits from winning position
- `getMarketState(marketId)` - View market details
- `getUserPosition(user, marketId)` - View user position
- `getOutcomePrice(marketId, outcomeId)` - View current outcome price

## Building

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Clone and setup
git clone <repo>
cd contracts

# Build contracts
forge build

# Run tests
forge test

# Deploy to Monad Testnet
export PRIVATE_KEY=0x...
export MONAD_RPC_URL=https://testnet-rpc.monad.xyz/
forge script script/Deploy.s.sol --rpc-url $MONAD_RPC_URL --private-key $PRIVATE_KEY --broadcast
```

## Environment Variables

```bash
PRIVATE_KEY=0x...              # Deployer's private key
MONAD_RPC_URL=https://testnet-rpc.monad.xyz/
ETHERSCAN_API_KEY=             # For verification
```

## Contract Addresses (Monad Testnet)

To be filled in after deployment:
- OrosUSD: `0x...`
- OrosMarket: `0x...`

## Testing

```bash
# Run all tests
forge test

# Run specific test
forge test --match-test testMint

# Run with verbosity
forge test -vv

# Run with trace
forge test -vvv
```

## Security

- ✅ Reentrancy protection (ReentrancyGuard)
- ✅ Solidity 0.8.x overflow/underflow protection
- ✅ Access control (Ownable for sensitive functions)
- ✅ Input validation on all functions

## Deployment Checklist

- [ ] Contracts compile without warnings
- [ ] All tests pass
- [ ] Deploy to testnet
- [ ] Verify contracts on block explorer
- [ ] Update .env with contract addresses
- [ ] Mint initial tokens for faucet
