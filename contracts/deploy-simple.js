#!/usr/bin/env node

// OROS CONTRACTS DEPLOYMENT SCRIPT
// Deploy OrosUSD + OrosMarket to Monad Testnet

const { ethers } = require('ethers');
require('dotenv').config();

// OrosUSD Contract ABI and Bytecode
const OROS_USD = {
  abi: [
    {
      inputs: [],
      name: 'constructor',
      type: 'constructor',
    },
    {
      inputs: [
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  // Note: This bytecode is truncated - you need the full bytecode from Remix
  bytecode: '0x', // Will be replaced
};

// OrosMarket Contract ABI
const OROS_MARKET = {
  abi: [
    {
      inputs: [{ internalType: 'address', name: '_orosToken', type: 'address' }],
      name: 'constructor',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'nextMarketId',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  bytecode: '0x',
};

async function main() {
  console.log('\n================================================================================');
  console.log('OROS SMART CONTRACTS DEPLOYMENT');
  console.log('================================================================================\n');

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const RPC_URL = process.env.MONAD_TESTNET_RPC_URL;

  if (!PRIVATE_KEY) {
    console.error('❌ Error: PRIVATE_KEY not set in .env');
    console.error('   Add: PRIVATE_KEY=0x...');
    process.exit(1);
  }

  if (!RPC_URL) {
    console.error('❌ Error: MONAD_TESTNET_RPC_URL not set in .env');
    console.error('   Add: MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz');
    process.exit(1);
  }

  // Connect to Monad Testnet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log(`📍 Deployer: ${signer.address}`);
  console.log(`🌐 Network: Monad Testnet`);
  console.log(`🔗 RPC: ${RPC_URL}\n`);

  // Check balance
  const balance = await provider.getBalance(signer.address);
  console.log(`💰 Wallet Balance: ${ethers.formatEther(balance)} MON\n`);

  if (balance === 0n) {
    console.error('❌ No MON tokens in wallet!');
    console.error('   Get testnet MON from: https://faucet.monad.xyz/');
    process.exit(1);
  }

  console.log('⚠️  NOTE: Full bytecode required to deploy');
  console.log('   Options:');
  console.log('   1. Use Remix IDE: https://remix.ethereum.org');
  console.log('   2. Install Foundry (without libusb issues)');
  console.log('   3. Use Hardhat instead of Foundry\n');

  console.log('================================================================================');
  console.log('NEXT STEPS');
  console.log('================================================================================\n');
  console.log('Option A: Use Remix IDE (recommended for now)');
  console.log('  1. Go to https://remix.ethereum.org');
  console.log('  2. Create OrosUSD.sol and OrosMarket.sol');
  console.log('  3. Compile both contracts');
  console.log('  4. Deploy with MetaMask connected');
  console.log('  5. Record contract addresses');
  console.log('  6. Update .env with addresses\n');

  console.log('Option B: Use Hardhat (install first)');
  console.log('  1. npm install --save-dev hardhat');
  console.log('  2. npx hardhat init');
  console.log('  3. Configure hardhat.config.js for Monad');
  console.log('  4. Run deployment script\n');

  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
