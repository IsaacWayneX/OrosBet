// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title OrosMarket
 * @dev Prediction market AMM using Constant Product Market Maker formula
 * Supports binary outcomes (YES/NO) for sports prediction markets
 */
contract OrosMarket is Ownable, ReentrancyGuard {
    IERC20 public orosToken;

    // Market structure
    struct Market {
        uint256 id;
        string description; // "Will Arsenal score > 1 goal?"
        string[] outcomes; // ["Yes", "No"]
        uint256 resolvedOutcome; // Which outcome won (0 if unresolved)
        uint256 createdAt;
        uint256 resolutionDeadline;
        bool resolved;
        mapping(uint256 => uint256) outcomeShares; // Shares per outcome
        mapping(uint256 => uint256) outcomeTokens; // Liquidity per outcome
    }

    // User position structure
    struct Position {
        uint256 marketId;
        uint256 outcomeId;
        uint256 shares;
        uint256 tokenAmount;
    }

    // State variables
    mapping(uint256 => Market) public markets;
    mapping(address => mapping(uint256 => Position)) public userPositions;
    uint256 public nextMarketId = 1;

    // Events
    event MarketCreated(
        uint256 indexed marketId,
        string description,
        string[] outcomes,
        uint256 resolutionDeadline
    );
    event SharesBought(
        uint256 indexed marketId,
        uint256 indexed outcome,
        address indexed buyer,
        uint256 amount,
        uint256 sharesReceived
    );
    event SharesSold(
        uint256 indexed marketId,
        uint256 indexed outcome,
        address indexed seller,
        uint256 shares,
        uint256 tokensReceived
    );
    event MarketResolved(uint256 indexed marketId, uint256 correctOutcome);
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed winner,
        uint256 amount
    );

    constructor(address _orosToken) {
        orosToken = IERC20(_orosToken);
    }

    /**
     * @dev Create a new prediction market
     */
    function createMarket(
        string memory description,
        string[] memory outcomes,
        uint256 resolutionDeadline,
        uint256 initialLiquidity
    ) external onlyOwner returns (uint256) {
        require(outcomes.length == 2, "Only binary outcomes supported");
        require(
            resolutionDeadline > block.timestamp,
            "Invalid deadline"
        );
        require(initialLiquidity > 0, "Invalid liquidity");

        uint256 marketId = nextMarketId++;
        Market storage market = markets[marketId];

        market.id = marketId;
        market.description = description;
        market.outcomes = outcomes;
        market.createdAt = block.timestamp;
        market.resolutionDeadline = resolutionDeadline;
        market.resolved = false;

        // Initialize AMM pool with equal liquidity for both outcomes
        market.outcomeTokens[0] = initialLiquidity / 2;
        market.outcomeTokens[1] = initialLiquidity / 2;
        market.outcomeShares[0] = 1000 * 10**18; // 1000 shares
        market.outcomeShares[1] = 1000 * 10**18; // 1000 shares

        emit MarketCreated(
            marketId,
            description,
            outcomes,
            resolutionDeadline
        );

        return marketId;
    }

    /**
     * @dev Buy shares of an outcome (place bet)
     * Uses CPMM: price = liquidityA / liquidityB
     */
    function buyShares(
        uint256 marketId,
        uint256 outcomeId,
        uint256 tokenAmount
    ) external nonReentrant returns (uint256) {
        require(!markets[marketId].resolved, "Market already resolved");
        require(outcomeId < 2, "Invalid outcome");
        require(tokenAmount > 0, "Invalid amount");

        Market storage market = markets[marketId];
        require(
            block.timestamp < market.resolutionDeadline,
            "Market expired"
        );

        // Transfer tokens from user to contract
        orosToken.transferFrom(msg.sender, address(this), tokenAmount);

        // Calculate shares using CPMM formula
        uint256 otherOutcomeId = 1 - outcomeId;
        uint256 k = market.outcomeTokens[outcomeId] *
            market.outcomeTokens[otherOutcomeId];
        uint256 newLiquidity = market.outcomeTokens[outcomeId] + tokenAmount;
        uint256 newOtherLiquidity = k / newLiquidity;
        uint256 tokensOut = market.outcomeTokens[otherOutcomeId] -
            newOtherLiquidity;

        // Calculate shares based on price movement
        uint256 sharesReceived = (tokenAmount * market.outcomeShares[outcomeId]) /
            market.outcomeTokens[outcomeId];

        // Update market state
        market.outcomeTokens[outcomeId] = newLiquidity;
        market.outcomeTokens[otherOutcomeId] = newOtherLiquidity;
        market.outcomeShares[outcomeId] -= sharesReceived;

        // Update user position
        userPositions[msg.sender][marketId].marketId = marketId;
        userPositions[msg.sender][marketId].outcomeId = outcomeId;
        userPositions[msg.sender][marketId].shares += sharesReceived;
        userPositions[msg.sender][marketId].tokenAmount += tokenAmount;

        emit SharesBought(
            marketId,
            outcomeId,
            msg.sender,
            tokenAmount,
            sharesReceived
        );

        return sharesReceived;
    }

    /**
     * @dev Sell shares back to the market
     */
    function sellShares(
        uint256 marketId,
        uint256 outcomeId,
        uint256 shares
    ) external nonReentrant returns (uint256) {
        require(!markets[marketId].resolved, "Market already resolved");
        require(outcomeId < 2, "Invalid outcome");

        Market storage market = markets[marketId];
        Position storage position = userPositions[msg.sender][marketId];

        require(position.shares >= shares, "Insufficient shares");

        // Calculate tokens received using CPMM formula
        uint256 tokensReceived = (shares * market.outcomeTokens[outcomeId]) /
            market.outcomeShares[outcomeId];

        // Update market state
        market.outcomeShares[outcomeId] += shares;
        market.outcomeTokens[outcomeId] -= tokensReceived;

        // Update user position
        position.shares -= shares;
        position.tokenAmount = position.tokenAmount > tokensReceived
            ? position.tokenAmount - tokensReceived
            : 0;

        // Transfer tokens to user
        orosToken.transfer(msg.sender, tokensReceived);

        emit SharesSold(marketId, outcomeId, msg.sender, shares, tokensReceived);

        return tokensReceived;
    }

    /**
     * @dev Resolve the market with correct outcome
     */
    function resolveMarket(uint256 marketId, uint256 correctOutcome)
        external
        onlyOwner
    {
        require(!markets[marketId].resolved, "Market already resolved");
        require(correctOutcome < 2, "Invalid outcome");
        require(
            block.timestamp >= markets[marketId].resolutionDeadline,
            "Cannot resolve before deadline"
        );

        markets[marketId].resolved = true;
        markets[marketId].resolvedOutcome = correctOutcome;

        emit MarketResolved(marketId, correctOutcome);
    }

    /**
     * @dev Claim winnings from resolved market
     */
    function claimWinnings(uint256 marketId) external nonReentrant returns (uint256) {
        require(markets[marketId].resolved, "Market not resolved");

        Position storage position = userPositions[msg.sender][marketId];
        require(position.shares > 0, "No position in this market");

        Market storage market = markets[marketId];
        require(
            position.outcomeId == market.resolvedOutcome,
            "You did not win this market"
        );

        // Calculate payout based on winning shares
        uint256 totalShares = market.outcomeShares[market.resolvedOutcome];
        uint256 totalPool = market.outcomeTokens[0] +
            market.outcomeTokens[1];
        uint256 winnerShare = (position.shares * totalPool) / totalShares;

        // Clear position
        position.shares = 0;
        position.tokenAmount = 0;

        // Transfer winnings
        orosToken.transfer(msg.sender, winnerShare);

        emit WinningsClaimed(marketId, msg.sender, winnerShare);

        return winnerShare;
    }

    /**
     * @dev Get market state
     */
    function getMarketState(uint256 marketId)
        external
        view
        returns (
            string memory description,
            string[] memory outcomes,
            bool resolved,
            uint256 resolvedOutcome,
            uint256[2] memory tokenLiquidity,
            uint256[2] memory shareLiquidity
        )
    {
        Market storage market = markets[marketId];
        return (
            market.description,
            market.outcomes,
            market.resolved,
            market.resolvedOutcome,
            [market.outcomeTokens[0], market.outcomeTokens[1]],
            [market.outcomeShares[0], market.outcomeShares[1]]
        );
    }

    /**
     * @dev Get user position in a market
     */
    function getUserPosition(address user, uint256 marketId)
        external
        view
        returns (
            uint256 outcomeId,
            uint256 shares,
            uint256 tokenAmount
        )
    {
        Position storage position = userPositions[user][marketId];
        return (position.outcomeId, position.shares, position.tokenAmount);
    }

    /**
     * @dev Get current price for an outcome (price = liquidity / shares)
     */
    function getOutcomePrice(uint256 marketId, uint256 outcomeId)
        external
        view
        returns (uint256)
    {
        Market storage market = markets[marketId];
        require(market.outcomeShares[outcomeId] > 0, "Invalid outcome");
        return (market.outcomeTokens[outcomeId] * 10**18) /
            market.outcomeShares[outcomeId];
    }
}
