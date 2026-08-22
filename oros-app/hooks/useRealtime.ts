"use client";

import { useEffect, useState } from "react";

export function useRealtime() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setConnected(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return { connected };
}
