"use client";

import { useEffect, useState } from "react";
import { getMarkets } from "@/lib/api";
import type { Market } from "@/types";

export function useMarkets() {
  const [data, setData] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarkets().then((markets) => {
      setData(markets);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
