// OROS CONTRACTS DEPLOYMENT SCRIPT
// Deploy OrosUSD + OrosMarket to Monad Testnet via terminal

const ethers = require('ethers');
require('dotenv').config();

// Contract ABIs (compiled Solidity)
const OROS_USD_ABI = [
  'constructor()',
  'function mint(address to, uint256 amount) external',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
];

const OROS_MARKET_ABI = [
  'constructor(address _orosToken)',
  'function nextMarketId() external view returns (uint256)',
  'function getTokenBalance() external view returns (uint256)',
];

// Compiled bytecode (from Remix or Foundry build)
// For OrosUSD - full bytecode from compilation
const OROS_USD_BYTECODE = require('./OROS_USD_BYTECODE.json').bytecode;
const OROS_MARKET_BYTECODE = require('./OROS_MARKET_BYTECODE.json').bytecode;

async function deploy() {
  console.log('\n================================================================================');
  console.log('OROS CONTRACTS DEPLOYMENT');
  console.log('================================================================================\n');

  // Load environment
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const RPC_URL = process.env.MONAD_TESTNET_RPC_URL;

  if (!PRIVATE_KEY || !RPC_URL) {
    console.error('❌ Error: Missing PRIVATE_KEY or MONAD_TESTNET_RPC_URL in .env');
    process.exit(1);
  }

  // Connect to Monad Testnet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const deployer = wallet.address;

  console.log(`Deployer: ${deployer}`);
  console.log(`Network: Monad Testnet`);
  console.log(`RPC: ${RPC_URL}\n`);

  // Check balance
  const balance = await provider.getBalance(deployer);
  console.log(`Wallet Balance: ${ethers.formatEther(balance)} MON\n`);

  if (balance === 0n) {
    console.error('❌ Error: Wallet has no MON tokens. Get testnet MON from faucet.');
    process.exit(1);
  }

  try {
    // Deploy OrosUSD
    console.log('📦 Deploying OrosUSD...');
    const OrosUSDFactory = new ethers.ContractFactory(OROS_USD_ABI, OROS_USD_BYTECODE, wallet);
    const orosUSD = await OrosUSDFactory.deploy();
    await orosUSD.waitForDeployment();
    const orosUSDAddress = await orosUSD.getAddress();
    console.log(`✅ OrosUSD deployed: ${orosUSDAddress}\n`);

    // Mint 1000 tokens
    console.log('💰 Minting 1000 OUSD...');
    const mintTx = await orosUSD.mint(deployer, ethers.parseEther('1000'));
    await mintTx.wait();
    const balance1000 = await orosUSD.balanceOf(deployer);
    console.log(`✅ Minted: ${ethers.formatEther(balance1000)} OUSD\n`);

    // Deploy OrosMarket
    console.log('📦 Deploying OrosMarket...');
    const OrosMarketFactory = new ethers.ContractFactory(OROS_MARKET_ABI, OROS_MARKET_BYTECODE, wallet);
    const orosMarket = await OrosMarketFactory.deploy(orosUSDAddress);
    await orosMarket.waitForDeployment();
    const orosMarketAddress = await orosMarket.getAddress();
    console.log(`✅ OrosMarket deployed: ${orosMarketAddress}\n`);

    // Verify deployment
    console.log('🔍 Verifying deployment...');
    const nextMarketId = await orosMarket.nextMarketId();
    console.log(`✅ OrosMarket nextMarketId: ${nextMarketId}\n`);

    // Output results
    console.log('================================================================================');
    console.log('DEPLOYMENT COMPLETE');
    console.log('================================================================================\n');
    console.log(`OrosUSD Address:   ${orosUSDAddress}`);
    console.log(`OrosMarket Address: ${orosMarketAddress}\n`);

    console.log('Update your .env with:');
    console.log(`OROS_TOKEN_ADDRESS=${orosUSDAddress}`);
    console.log(`OROS_MARKET_ADDRESS=${orosMarketAddress}\n`);

    console.log('Block Explorer:');
    console.log(`https://monad-testnet.blockscout.com/address/${orosUSDAddress}`);
    console.log(`https://monad-testnet.blockscout.com/address/${orosMarketAddress}\n`);

    return {
      orosUSD: orosUSDAddress,
      orosMarket: orosMarketAddress,
    };
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
