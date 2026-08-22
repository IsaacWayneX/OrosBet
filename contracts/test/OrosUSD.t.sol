// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OrosUSD.sol";

contract OrosUSDTest is Test {
    OrosUSD public token;
    address owner;
    address user1;
    address user2;

    function setUp() public {
        token = new OrosUSD();
        owner = msg.sender;
        user1 = address(0x1);
        user2 = address(0x2);
    }

    function testMint() public {
        uint256 amount = 1000 * 10**18;
        token.mint(user1, amount);
        assertEq(token.balanceOf(user1), amount);
    }

    function testBurn() public {
        uint256 amount = 1000 * 10**18;
        token.mint(user1, amount);
        
        vm.prank(user1);
        token.burn(500 * 10**18);
        
        assertEq(token.balanceOf(user1), 500 * 10**18);
    }

    function testTransfer() public {
        uint256 amount = 1000 * 10**18;
        token.mint(user1, amount);
        
        vm.prank(user1);
        token.transfer(user2, 300 * 10**18);
        
        assertEq(token.balanceOf(user1), 700 * 10**18);
        assertEq(token.balanceOf(user2), 300 * 10**18);
    }

    function testApproveAndTransferFrom() public {
        uint256 amount = 1000 * 10**18;
        token.mint(user1, amount);
        
        vm.prank(user1);
        token.approve(user2, 500 * 10**18);
        
        vm.prank(user2);
        token.transferFrom(user1, user2, 300 * 10**18);
        
        assertEq(token.balanceOf(user1), 700 * 10**18);
        assertEq(token.balanceOf(user2), 300 * 10**18);
        assertEq(token.allowance(user1, user2), 200 * 10**18);
    }

    function testBurnFrom() public {
        uint256 amount = 1000 * 10**18;
        token.mint(user1, amount);
        
        vm.prank(user1);
        token.approve(user2, 500 * 10**18);
        
        vm.prank(user2);
        token.burnFrom(user1, 300 * 10**18);
        
        assertEq(token.balanceOf(user1), 700 * 10**18);
        assertEq(token.allowance(user1, user2), 200 * 10**18);
    }

    function testMintOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        token.mint(user1, 1000 * 10**18);
    }
}
