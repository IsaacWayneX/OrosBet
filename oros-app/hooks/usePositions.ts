"use client";

import { useEffect, useState } from "react";
import { getPositions } from "@/lib/api";
import type { Position } from "@/types";

export function usePositions() {
  const [data, setData] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPositions().then((positions) => {
      setData(positions);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
