#!/bin/bash

// OROS DEPLOYMENT SCRIPT (BASH)
// Deploy contracts to Monad Testnet using ethers.js

set -e

echo "================================================================================"
echo "OROS CONTRACTS DEPLOYMENT"
echo "================================================================================"
echo ""

// Load environment
source .env

if [ -z "$PRIVATE_KEY" ] || [ -z "$MONAD_TESTNET_RPC_URL" ]; then
  echo "❌ Error: Missing PRIVATE_KEY or MONAD_TESTNET_RPC_URL in .env"
  exit 1
fi

echo "Deployer Address: $(cast wallet address $PRIVATE_KEY)"
echo "Network: Monad Testnet"
echo "RPC: $MONAD_TESTNET_RPC_URL"
echo ""

// Check balance
BALANCE=$(cast balance $(cast wallet address $PRIVATE_KEY) --rpc-url $MONAD_TESTNET_RPC_URL)
echo "Wallet Balance: $BALANCE MON"
echo ""

if [ "$BALANCE" == "0" ]; then
  echo "❌ Error: Wallet has no MON tokens. Get testnet MON from faucet."
  exit 1
fi

echo "Ready to deploy!"
