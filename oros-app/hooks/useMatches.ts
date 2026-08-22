"use client";

import { useEffect, useState } from "react";
import { getMatches } from "@/lib/api";
import type { Match } from "@/types";

export function useMatches() {
  const [data, setData] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then((matches) => {
      setData(matches);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
