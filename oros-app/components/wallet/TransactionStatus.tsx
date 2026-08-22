import { Card } from "@/components/ui/Card";
import type { Transaction } from "@/types";

export function TransactionStatus({ transaction }: { transaction: Transaction | null }) {
  if (!transaction) return null;

  return (
    <Card>
      <h3 className="font-semibold">{transaction.label}</h3>
      <p className="mt-2 text-sm text-slate-300">Status: {transaction.status}</p>
      {transaction.hash ? <p className="mt-1 break-all text-xs text-slate-500">{transaction.hash}</p> : null}
    </Card>
  );
}
