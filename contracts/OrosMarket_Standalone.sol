// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OrosMarket - Standalone CPMM Market (No external imports)
interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract OrosMarket {
    IERC20 public orosToken;
    address public owner;

    // Market structure
    struct Market {
        uint256 id;
        string description;
        string[] outcomes;
        uint256 resolvedOutcome;
        uint256 createdAt;
        uint256 resolutionDeadline;
        bool resolved;
    }

    // User position
    struct Position {
        uint256 marketId;
        uint256 outcomeId;
        uint256 shares;
        uint256 tokenAmount;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(uint256 => uint256)) public outcomeShares;
    mapping(uint256 => mapping(uint256 => uint256)) public outcomeTokens;
    mapping(address => mapping(uint256 => Position)) public userPositions;
    uint256 public nextMarketId = 1;

    event MarketCreated(uint256 indexed marketId, string description, uint256 resolutionDeadline);
    event SharesBought(uint256 indexed marketId, uint256 indexed outcome, address indexed buyer, uint256 amount, uint256 shares);
    event SharesSold(uint256 indexed marketId, uint256 indexed outcome, address indexed seller, uint256 shares, uint256 tokensReceived);
    event MarketResolved(uint256 indexed marketId, uint256 correctOutcome);
    event WinningsClaimed(uint256 indexed marketId, address indexed winner, uint256 amount);

    constructor(address _orosToken) {
        orosToken = IERC20(_orosToken);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _; 
    }

    // Create market
    function createMarket(
        string memory description,
        string[] memory outcomes,
        uint256 resolutionDeadline,
        uint256 initialLiquidity
    ) external onlyOwner returns (uint256) {
        require(outcomes.length == 2, "Only binary outcomes");
        require(resolutionDeadline > block.timestamp, "Invalid deadline");
        require(initialLiquidity > 0, "Invalid liquidity");

        uint256 marketId = nextMarketId++;
        Market storage market = markets[marketId];

        market.id = marketId;
        market.description = description;
        market.outcomes = outcomes;
        market.createdAt = block.timestamp;
        market.resolutionDeadline = resolutionDeadline;
        market.resolved = false;

        // Initialize AMM pool
        outcomeTokens[marketId][0] = initialLiquidity / 2;
        outcomeTokens[marketId][1] = initialLiquidity / 2;
        outcomeShares[marketId][0] = initialLiquidity / 2;
        outcomeShares[marketId][1] = initialLiquidity / 2;

        emit MarketCreated(marketId, description, resolutionDeadline);
        return marketId;
    }

    // Get market
    function getMarket(uint256 marketId) external view returns (
        string memory,
        string[] memory,
        bool,
        uint256
    ) {
        Market storage market = markets[marketId];
        return (market.description, market.outcomes, market.resolved, market.resolvedOutcome);
    }

    // Buy shares (CPMM formula)
    function buyShares(uint256 marketId, uint256 outcomeId, uint256 amountIn) external returns (uint256) {
        require(amountIn > 0, "Amount must be positive");
        
        Market storage market = markets[marketId];
        require(!market.resolved, "Market resolved");

        // CPMM: shares = (amountIn * outcomeShares) / (outcomeTokens + amountIn)
        uint256 shares = (amountIn * outcomeShares[marketId][outcomeId]) / 
                         (outcomeTokens[marketId][outcomeId] + amountIn);

        outcomeTokens[marketId][outcomeId] += amountIn;
        outcomeShares[marketId][outcomeId] -= shares;

        require(orosToken.transferFrom(msg.sender, address(this), amountIn), "Transfer failed");

        userPositions[msg.sender][marketId].marketId = marketId;
        userPositions[msg.sender][marketId].outcomeId = outcomeId;
        userPositions[msg.sender][marketId].shares += shares;
        userPositions[msg.sender][marketId].tokenAmount += amountIn;

        emit SharesBought(marketId, outcomeId, msg.sender, amountIn, shares);
        return shares;
    }

    // Sell shares (CPMM formula)
    function sellShares(uint256 marketId, uint256 outcomeId, uint256 sharesToSell) external returns (uint256) {
        require(sharesToSell > 0, "Shares must be positive");
        
        Market storage market = markets[marketId];
        require(!market.resolved, "Market resolved");

        Position storage pos = userPositions[msg.sender][marketId];
        require(pos.shares >= sharesToSell, "Insufficient shares");

        // CPMM: tokensOut = (sharesToSell * outcomeTokens) / (outcomeShares + sharesToSell)
        uint256 tokensOut = (sharesToSell * outcomeTokens[marketId][outcomeId]) /
                            (outcomeShares[marketId][outcomeId] + sharesToSell);

        outcomeShares[marketId][outcomeId] += sharesToSell;
        outcomeTokens[marketId][outcomeId] -= tokensOut;

        pos.shares -= sharesToSell;
        pos.tokenAmount -= tokensOut;

        require(orosToken.transfer(msg.sender, tokensOut), "Transfer failed");

        emit SharesSold(marketId, outcomeId, msg.sender, sharesToSell, tokensOut);
        return tokensOut;
    }

    // Resolve market
    function resolveMarket(uint256 marketId, uint256 correctOutcome) external onlyOwner {
        require(correctOutcome < 2, "Invalid outcome");
        
        Market storage market = markets[marketId];
        require(!market.resolved, "Already resolved");

        market.resolved = true;
        market.resolvedOutcome = correctOutcome;

        emit MarketResolved(marketId, correctOutcome);
    }

    // Claim winnings
    function claimWinnings(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(market.resolved, "Market not resolved");

        Position storage pos = userPositions[msg.sender][marketId];
        require(pos.shares > 0, "No position");

        if (pos.outcomeId == market.resolvedOutcome) {
            uint256 winnings = pos.tokenAmount;
            pos.shares = 0;
            pos.tokenAmount = 0;

            require(orosToken.transfer(msg.sender, winnings), "Transfer failed");
            emit WinningsClaimed(marketId, msg.sender, winnings);
        } else {
            pos.shares = 0;
            pos.tokenAmount = 0;
        }
    }

    // Get outcome price
    function getOutcomePrice(uint256 marketId, uint256 outcomeId) external view returns (uint256) {
        if (outcomeShares[marketId][outcomeId] == 0) return 0;
        return (outcomeTokens[marketId][outcomeId] * 1e18) / outcomeShares[marketId][outcomeId];
    }

    // Get token balance
    function getTokenBalance() external view returns (uint256) {
        return orosToken.balanceOf(address(this));
    }
}
