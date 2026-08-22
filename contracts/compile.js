const path = require('path');
const fs = require('fs');
const solc = require('solc');

console.log('Compiling Solidity contracts...');

function findImports(importPath) {
  try {
    let resolvedPath;
    if (importPath.startsWith('@openzeppelin/')) {
      resolvedPath = path.resolve(__dirname, 'node_modules', importPath);
    } else {
      resolvedPath = path.resolve(__dirname, 'src', importPath);
    }
    
    if (fs.existsSync(resolvedPath)) {
      return { contents: fs.readFileSync(resolvedPath, 'utf8') };
    }
    
    // Check fallback for nested imports
    const fallbackPath = path.resolve(__dirname, importPath);
    if (fs.existsSync(fallbackPath)) {
      return { contents: fs.readFileSync(fallbackPath, 'utf8') };
    }
    
    return { error: `File not found: ${importPath}` };
  } catch (err) {
    return { error: err.message };
  }
}

const usdPath = path.resolve(__dirname, 'src', 'OrosUSD.sol');
const marketPath = path.resolve(__dirname, 'src', 'OrosMarket.sol');

const usdSource = fs.readFileSync(usdPath, 'utf8');
const marketSource = fs.readFileSync(marketPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'OrosUSD.sol': { content: usdSource },
    'OrosMarket.sol': { content: marketSource }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
  let hasErrors = false;
  output.errors.forEach(err => {
    console.log(`[${err.severity.toUpperCase()}] ${err.formattedMessage}`);
    if (err.severity === 'error') {
      hasErrors = true;
    }
  });
  if (hasErrors) {
    console.error('❌ Compilation failed due to errors.');
    process.exit(1);
  }
}

const usdContracts = output.contracts['OrosUSD.sol'];
const marketContracts = output.contracts['OrosMarket.sol'];

const usdBytecode = usdContracts['OrosUSD'].evm.bytecode.object;
const marketBytecode = marketContracts['OrosMarket'].evm.bytecode.object;

fs.writeFileSync(
  path.resolve(__dirname, 'OROS_USD_BYTECODE.json'),
  JSON.stringify({ bytecode: '0x' + usdBytecode }, null, 2)
);

fs.writeFileSync(
  path.resolve(__dirname, 'OROS_MARKET_BYTECODE.json'),
  JSON.stringify({ bytecode: '0x' + marketBytecode }, null, 2)
);

console.log('✅ Compilation successful! Bytecode files generated.');
