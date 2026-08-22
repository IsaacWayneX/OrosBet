"use client";

import { useEffect, useState } from "react";
import { getPortfolio } from "@/lib/api";
import type { PortfolioSummary } from "@/types";

export function usePortfolio() {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolio().then((portfolio) => {
      setData(portfolio);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
