"use client";

import { useEffect, useState } from "react";
import { getMatch } from "@/lib/api";
import type { Match } from "@/types";

export function useMatch(matchId: string) {
  const [data, setData] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatch(matchId).then((match) => {
      setData(match);
      setLoading(false);
    });
  }, [matchId]);

  return { data, loading };
}
