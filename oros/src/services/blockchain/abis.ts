/**
 * Smart contract ABIs
 * Exported for use with Viem client
 */

export const OROS_TOKEN_ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "burn",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const OROS_MARKET_ABI = [
  {
    type: "function",
    name: "createMarket",
    inputs: [
      { name: "description", type: "string" },
      { name: "outcomes", type: "string[]" },
      { name: "resolutionDeadline", type: "uint256" },
      { name: "initialLiquidity", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "buyShares",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcomeId", type: "uint256" },
      { name: "tokenAmount", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sellShares",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcomeId", type: "uint256" },
      { name: "shares", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "resolveMarket",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "correctOutcome", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimWinnings",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getMarketState",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "description", type: "string" },
          { name: "outcomes", type: "string[]" },
          { name: "resolved", type: "bool" },
          { name: "resolvedOutcome", type: "uint256" },
          { name: "tokenLiquidity", type: "uint256[2]" },
          { name: "shareLiquidity", type: "uint256[2]" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserPosition",
    inputs: [
      { name: "user", type: "address" },
      { name: "marketId", type: "uint256" },
    ],
    outputs: [
      { name: "outcomeId", type: "uint256" },
      { name: "shares", type: "uint256" },
      { name: "tokenAmount", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOutcomePrice",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcomeId", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;
