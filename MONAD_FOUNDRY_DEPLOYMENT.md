// OROS DEPLOYMENT USING MONAD FOUNDRY
// Official Monad deployment method

================================================================================
STEP 1: MONAD FOUNDRY INSTALLATION
================================================================================

Already done:
✓ curl -L https://foundry.category.xyz | bash
✓ Waiting for: foundryup --network monad

This is installing forge, cast, anvil, chisel with Monad support.

================================================================================
STEP 2: VERIFY INSTALLATION
================================================================================

Once installation completes, check:

export PATH="$HOME/.foundry/bin:$PATH"

forge --version
cast --version

Should show Monad-enabled versions.

================================================================================
STEP 3: UPDATE FOUNDRY.TOL FOR MONAD
================================================================================

File: /Users/macbook/Desktop/Oros/contracts/foundry.toml

Already configured:
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.20"
optimizer = true
optimizer_runs = 200

# Monad Testnet
eth-rpc-url = "https://testnet-rpc.monad.xyz"
chain_id = 10143

================================================================================
STEP 4: CREATE KEYSTORE (RECOMMENDED - SAFER THAN PRIVATE KEY)
================================================================================

Generate new wallet and import to keystore:

cast wallet import oros-deployer --private-key $(cast wallet new | grep 'Private key:' | awk '{print $3}')

Or use your existing private key:

cast wallet import oros-deployer --private-key 0xc0b1926e088fc7ed90a1878f84a75fb92c5b9cc699f377a7751f51e72f97b6a3

When prompted, enter a password to encrypt the keystore.

Get the keystore address:

cast wallet address --account oros-deployer

Should show: 0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f

================================================================================
STEP 5: VERIFY WALLET HAS MON TOKENS
================================================================================

Check balance:

cast balance 0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f --rpc-url https://testnet-rpc.monad.xyz

Should show MON balance (you already have testnet MON from faucet).

================================================================================
STEP 6: COMPILE CONTRACTS
================================================================================

cd /Users/macbook/Desktop/Oros/contracts

forge build

Expected output:
Compiling 2 files with 0.8.20
Compilation successful

================================================================================
STEP 7: CREATE DEPLOY SCRIPT
================================================================================

File: /Users/macbook/Desktop/Oros/contracts/script/Deploy.s.sol

Already exists and is correct for Monad.

================================================================================
STEP 8: DEPLOY OROSTUSD
================================================================================

Option A: Using Keystore (RECOMMENDED)

forge create src/OrosUSD.sol:OrosUSD \
  --account oros-deployer \
  --broadcast \
  --rpc-url https://testnet-rpc.monad.xyz

When prompted, enter your keystore password.

Expected output:
Deployer: 0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f
Deployed to: 0x...
Transaction hash: 0x...

SAVE THE ADDRESS: 0x...

Option B: Using Private Key (NOT RECOMMENDED)

forge create src/OrosUSD.sol:OrosUSD \
  --private-key 0xc0b1926e088fc7ed90a1878f84a75fb92c5b9cc699f377a7751f51e72f97b6a3 \
  --broadcast \
  --rpc-url https://testnet-rpc.monad.xyz

================================================================================
STEP 9: MINT 1000 OUSD
================================================================================

Using cast to call mint function:

OrosUSD_ADDRESS=0x...  # Replace with deployed address
DEPLOYER_ADDRESS=0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f

cast send $OrosUSD_ADDRESS \
  "mint(address,uint256)" \
  $DEPLOYER_ADDRESS \
  1000000000000000000000 \
  --account oros-deployer \
  --rpc-url https://testnet-rpc.monad.xyz

Verify balance:

cast call $OrosUSD_ADDRESS \
  "balanceOf(address)(uint256)" \
  $DEPLOYER_ADDRESS \
  --rpc-url https://testnet-rpc.monad.xyz

Should show: 1000000000000000000000 (1000 tokens)

================================================================================
STEP 10: DEPLOY OROSMARKET
================================================================================

Using keystore:

OrosUSD_ADDRESS=0x...  # Replace with OrosUSD address

forge create src/OrosMarket.sol:OrosMarket \
  --constructor-args $OrosUSD_ADDRESS \
  --account oros-deployer \
  --broadcast \
  --rpc-url https://testnet-rpc.monad.xyz

Expected output:
Deployer: 0xBAAeA2583AFdd8d2dffb27150d9488e1a89B1E5f
Deployed to: 0x...
Transaction hash: 0x...

SAVE THIS ADDRESS: 0x...

================================================================================
STEP 11: VERIFY ON BLOCK EXPLORER
================================================================================

Go to: https://monad-testnet.blockscout.com/

Search for OrosUSD address:
- Should show contract
- Should show name "OrosUSD" or "Oros USD"
- Should show 1000 OUSD total supply

Search for OrosMarket address:
- Should show contract
- Should show functions: createMarket, buyShares, sellShares, etc.

================================================================================
STEP 12: UPDATE BACKEND .ENV
================================================================================

File: /Users/macbook/Desktop/Oros/oros/.env

Update:

OROS_TOKEN_ADDRESS=0x...  # OrosUSD address
OROS_MARKET_ADDRESS=0x...  # OrosMarket address
RESOLVER_PRIVATE_KEY=c0b1926e088fc7ed90a1878f84a75fb92c5b9cc699f377a7751f51e72f97b6a3

================================================================================
STEP 13: START BACKEND
================================================================================

cd /Users/macbook/Desktop/Oros/oros

npm install
npm run dev

Expected:
✓ Backend starting on port 4001
✓ Connected to Monad RPC
✓ Contracts loaded
✓ Ready to accept requests

================================================================================
DEPLOYMENT COMPLETE
================================================================================

You now have:
✓ OrosUSD deployed on Monad Testnet
✓ OrosMarket deployed on Monad Testnet
✓ 1000 OUSD minted
✓ Backend running

Next: Frontend integration

Block Explorer: https://monad-testnet.blockscout.com/

================================================================================
