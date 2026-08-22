// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OrosUSD.sol";
import "../src/OrosMarket.sol";

contract Deploy is Script {
    function run() external returns (OrosUSD token, OrosMarket market) {
        vm.startBroadcast();

        // Deploy OrosUSD token
        token = new OrosUSD();
        console.log("OrosUSD deployed at:", address(token));

        // Deploy OrosMarket
        market = new OrosMarket(address(token));
        console.log("OrosMarket deployed at:", address(market));

        // Mint initial 1000 tokens for testing
        token.mint(msg.sender, 1000 * 10**18);
        console.log("Minted 1000 OUSD to deployer");

        vm.stopBroadcast();

        // Log addresses for environment setup
        console.log("\n=== Deployment Complete ===");
        console.log("OrosUSD Address:", address(token));
        console.log("OrosMarket Address:", address(market));
        console.log("Add to .env:");
        console.log("OROS_TOKEN_ADDRESS=", address(token));
        console.log("OROS_MARKET_ADDRESS=", address(market));
    }
}
