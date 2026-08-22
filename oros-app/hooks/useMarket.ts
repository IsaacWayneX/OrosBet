"use client";

import { useEffect, useState } from "react";
import { getMarket } from "@/lib/api";
import type { Market } from "@/types";

export function useMarket(marketId: string) {
  const [data, setData] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarket(marketId).then((market) => {
      setData(market);
      setLoading(false);
    });
  }, [marketId]);

  return { data, loading };
}
