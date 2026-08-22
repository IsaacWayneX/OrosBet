// OROS MONAD TESTNET DEPLOYMENT GUIDE
// Step-by-step instructions for deploying to Monad (Chain ID: 10143)

================================================================================
MONAD TESTNET CONFIGURATION
================================================================================

Network Details:
- Name: Monad Testnet
- Chain ID: 10143
- RPC URL: https://testnet-rpc.monad.xyz/
- Currency: MON (testnet tokens)
- Block Explorer: https://monad-testnet.blockscout.com/

Current Status in .env:
✓ MONAD_RPC_URL=https://testnet-rpc.monad.xyz/
✓ Foundry configured for Monad
✓ Both contract addresses placeholders ready

================================================================================
STEP 1: SETUP WALLET
================================================================================

Option A: Use MetaMask
1. Open MetaMask
2. Add Network:
   - Network Name: Monad Testnet
   - RPC URL: https://testnet-rpc.monad.xyz/
   - Chain ID: 10143
   - Symbol: MON
3. Get deployer address
4. Export private key (NEVER share this)

Option B: Create New Account
1. Generate new private key:
   cast wallet new

2. Copy the private key (starts with 0x)

3. Note: Save this somewhere secure

================================================================================
STEP 2: FUND WALLET WITH TESTNET MON
================================================================================

Go to Monad Faucet:
URL: https://faucet.monad.xyz/

Steps:
1. Enter your wallet address (0x...)
2. Complete any required verification
3. Claim MON tokens
4. Wait for transaction to confirm

Verify Funding:
cast balance 0x[YOUR_ADDRESS] --rpc-url https://testnet-rpc.monad.xyz/

Expected: Your wallet should have MON balance

================================================================================
STEP 3: PREPARE DEPLOYMENT
================================================================================

Location: /Users/macbook/Desktop/Oros/contracts/

Step 1: Set Environment Variables
export PRIVATE_KEY=0x[YOUR_PRIVATE_KEY]
export MONAD_RPC_URL=https://testnet-rpc.monad.xyz/

Step 2: Verify Contracts Compile
forge build

Expected output:
  Compiling 2 files with 0.8.20
  Compilation successful

Step 3: Check Deployment Script
cat script/Deploy.s.sol

The script will:
1. Deploy OrosUSD token
2. Deploy OrosMarket
3. Mint initial tokens (1M OUSD)
4. Log all contract addresses

================================================================================
STEP 4: DEPLOY TO MONAD TESTNET
================================================================================

Command:
cd /Users/macbook/Desktop/Oros/contracts

forge script script/Deploy.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --private-key 0x[YOUR_PRIVATE_KEY] \
  --broadcast

Expected Output:
  ============================================================
  Deploying to Monad Testnet...
  ============================================================
  
  OrosUSD deployed at: 0x030f0274303db2dc0ecd5ad3c467d8a709001b06
  OrosMarket deployed at: 0x9ca237b1e8066af75b8add641785598e95e315cf
  
  Mint transaction: 0x...
  
  ============================================================
  Deployment Complete
  ============================================================

Note: The deployment might take 30-60 seconds

================================================================================
STEP 5: VERIFY DEPLOYMENT
================================================================================

Check Contract on Block Explorer:
1. Go to: https://monad-testnet.blockscout.com/
2. Search for contract address (0x...)
3. Verify:
   - Contract code is visible
   - Constructor arguments match
   - Function list is correct

Verify via CLI:
// Check OrosUSD balance at deployer account
cast call 0x[TOKEN_ADDRESS] "balanceOf(address)(uint256)" 0x[YOUR_ADDRESS] \
  --rpc-url https://testnet-rpc.monad.xyz/

Expected: 1000000000000000000000000 (1M tokens)

// Check OrosMarket owner
cast call 0x[MARKET_ADDRESS] "nextMarketId()(uint256)" \
  --rpc-url https://testnet-rpc.monad.xyz/

Expected: 1 (no markets created yet)

================================================================================
STEP 6: RECORD DEPLOYMENT ADDRESSES
================================================================================

File: /Users/macbook/Desktop/Oros/guide/DEPLOYMENT_ADDRESSES.md

Update with:
| Contract | Address | Status |
|----------|---------|--------|
| OrosUSD | 0x... | Deployed |
| OrosMarket | 0x... | Deployed |

Also record:
- Deployment date and time
- Transaction hashes
- Deployer address
- Monad testnet confirmation

================================================================================
STEP 7: UPDATE BACKEND .ENV
================================================================================

File: /Users/macbook/Desktop/Oros/oros/.env

Update these three lines with deployed addresses:
OROS_TOKEN_ADDRESS=0x[DEPLOYED_TOKEN_ADDRESS]
OROS_MARKET_ADDRESS=0x[DEPLOYED_MARKET_ADDRESS]
RESOLVER_PRIVATE_KEY=0x[YOUR_PRIVATE_KEY]

Example:
OROS_TOKEN_ADDRESS=0x030f0274303db2dc0ecd5ad3c467d8a709001b06
OROS_MARKET_ADDRESS=0x9ca237b1e8066af75b8add641785598e95e315cf
RESOLVER_PRIVATE_KEY=0xa9ea370fad4547fd92ea39234ac8b5e265530fbdecd34c3d85e4dca2d581fc76

Warning: Never commit .env file with private keys to git!

================================================================================
STEP 8: START BACKEND
================================================================================

cd /Users/macbook/Desktop/Oros/oros

pnpm install
pnpm run build
pnpm run dev

Expected output:
============================================================
OROS BACKEND STARTING
============================================================

Environment: development
Port: 4001
Server: http://localhost:4001
Health: http://localhost:4001/health

RPC: https://testnet-rpc.monad.xyz/
Database: Configured
Supabase: Configured

Ready to accept requests.
============================================================

================================================================================
STEP 9: TEST DEPLOYMENT
================================================================================

Test 1: Health Check
curl http://localhost:4001/health

Expected:
{
  "status": "ok",
  "timestamp": "2026-08-22T...",
  "environment": "development"
}

Test 2: Get Live Games
curl http://localhost:4001/api/v1/livegames

Expected: Mock sports data

Test 3: List Markets (should be empty)
curl http://localhost:4001/api/v1/markets

Expected:
{
  "markets": [],
  "total": 0,
  "limit": 20,
  "offset": 0,
  "timestamp": "..."
}

Test 4: Faucet Claim
curl -X POST http://localhost:4001/api/v1/faucet/claim \
  -H 'Content-Type: application/json' \
  -d '{"address":"0x[YOUR_ADDRESS]"}'

Expected: 100 OUSD claim success message

================================================================================
MONAD CONFIGURATION SUMMARY
================================================================================

Current Setup:
✓ Monad Testnet RPC: https://testnet-rpc.monad.xyz/
✓ Solidity Compiler: 0.8.20
✓ Foundry: Configured
✓ Environment: Development
✓ Backend Port: 4001

Deployment Target:
✓ Network: Monad Testnet (Chain 10143)
✓ Contracts: OrosUSD + OrosMarket
✓ Test Tokens: 1M OUSD

Post-Deployment:
✓ Backend connects to Monad RPC
✓ 14 API endpoints functional
✓ Frontend ready to consume endpoints

================================================================================
TROUBLESHOOTING
================================================================================

Error: "Insufficient balance for gas"
Fix: Go to faucet and claim more MON tokens

Error: "Library not loaded: libusb"
Fix: brew install libusb && foundryup

Error: "Connection refused" for RPC
Fix: Check internet connection, verify RPC URL is correct

Error: "Deployment failed - transaction reverted"
Fix: Ensure wallet has enough MON for gas fees

Error: "Private key format invalid"
Fix: Ensure private key starts with 0x and is 64 hex characters

Error: "Contract already deployed"
Fix: Use different private key or check if already deployed

Verify Deployment:
1. Check block explorer: https://monad-testnet.blockscout.com/
2. Search for your contract address
3. Verify contract code is visible
4. Check transaction history

================================================================================
NEXT STEPS AFTER DEPLOYMENT
================================================================================

1. Frontend Development (Phase 2)
   - Build Next.js app
   - Connect to backend API
   - Integrate MetaMask
   - Create UI components

2. Testing
   - Create markets
   - Place bets
   - Resolve markets
   - Claim winnings

3. Monitoring
   - Check block explorer
   - Monitor transaction status
   - Track gas usage
   - Log errors

4. Mainnet Preparation
   - Security audit
   - Performance testing
   - Documentation finalization
   - Launch planning

================================================================================
DEPLOYMENT CHECKLIST
================================================================================

Pre-Deployment:
[ ] Wallet created and private key saved
[ ] Wallet funded with MON from faucet
[ ] Contracts compile: forge build
[ ] Environment variables set
[ ] Monad RPC URL verified

Deployment:
[ ] Run deployment script
[ ] Wait for transactions to confirm
[ ] Record contract addresses
[ ] Verify on block explorer

Post-Deployment:
[ ] Update backend .env
[ ] Start backend server
[ ] Test health endpoint
[ ] Test all 14 endpoints
[ ] Document deployment details

Ready to Launch:
[ ] All tests passing
[ ] Backend responding
[ ] Frontend can consume APIs
[ ] Documentation updated

================================================================================
SUMMARY: MONAD TESTNET DEPLOYMENT
================================================================================

Status: READY TO DEPLOY

Contracts: Compiled and tested
Backend: Configured for Monad
Environment: All variables set
Faucet: Available for test tokens

Next Action: Deploy contracts to Monad testnet

All instructions above. Follow step by step for successful deployment.

================================================================================
