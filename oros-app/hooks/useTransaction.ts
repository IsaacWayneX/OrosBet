"use client";

import { useState } from "react";
import type { Transaction } from "@/types";

export function useTransaction() {
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  async function begin(label: string) {
    setTransaction({
      id: crypto.randomUUID(),
      label,
      type: "buy",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    await new Promise((resolve) => setTimeout(resolve, 800));

    setTransaction((current) =>
      current
        ? {
            ...current,
            status: "confirmed",
            hash: "0xmocktransactionhash",
          }
        : null
    );
  }

  return { transaction, begin };
}
