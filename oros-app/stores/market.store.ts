export interface MarketFilters {
  status: "all" | "open" | "resolved";
  query: string;
}

let marketFilters: MarketFilters = {
  status: "all",
  query: "",
};

export function getMarketFilters() {
  return marketFilters;
}

export function setMarketFilters(next: Partial<MarketFilters>) {
  marketFilters = { ...marketFilters, ...next };
  return marketFilters;
}
