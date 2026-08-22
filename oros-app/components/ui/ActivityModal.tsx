"use client";

import { useActivity } from "@/hooks/useActivity";
import { Modal } from "@/components/ui/Modal";
import { Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export function ActivityModal() {
  const { open, title, step, status, errorMsg, txHash, close } = useActivity();

  if (!open) return null;

  return (
    <Modal open={open} title={title}>
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        {status === "loading" && (
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Loader2 className="h-7 w-7 animate-spin stroke-[2.5px]" />
          </div>
        )}

        {status === "success" && (
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="h-7 w-7 stroke-[2.5px]" />
          </div>
        )}

        {status === "error" && (
          <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <XCircle className="h-7 w-7 stroke-[2.5px]" />
          </div>
        )}

        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{step}</p>
          {errorMsg && (
            <p className="text-xs text-rose-500 mt-2 max-h-24 overflow-y-auto font-mono max-w-sm px-2">
              {errorMsg}
            </p>
          )}
        </div>

        {txHash && (
          <a
            href={`https://monad-testnet.blockscout.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#1475E1] hover:underline font-semibold mt-1"
          >
            <span>View on Monad Explorer</span>
            <ExternalLink size={12} />
          </a>
        )}

        {status !== "loading" && (
          <button
            onClick={close}
            className="mt-2 w-full h-10 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition active:scale-[0.98]"
          >
            Close Dialog
          </button>
        )}
      </div>
    </Modal>
  );
}
