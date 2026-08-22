// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OrosUSD
 * @dev ERC-20 token for Oros prediction market platform
 * Used for betting and liquidity provision
 */
contract OrosUSD is ERC20, Ownable {
    constructor() ERC20("Oros USD", "OUSD") {}

    /**
     * @dev Mint tokens (admin only)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Burn tokens from another address (requires approval)
     */
    function burnFrom(address account, uint256 amount) external {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(
            currentAllowance >= amount,
            "ERC20: burn amount exceeds allowance"
        );
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
    }
}
