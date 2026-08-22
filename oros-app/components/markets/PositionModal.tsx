"use client";

import { Modal } from "@/components/ui/Modal";

export function PositionModal({ open, side }: { open: boolean; side: "yes" | "no" }) {
  return (
    <Modal open={open} title={`Open ${side.toUpperCase()} position`}>
      <p className="text-sm text-slate-300">
        This is a soft-auth trading flow placeholder. Later this modal can submit wallet or backend actions.
      </p>
    </Modal>
  );
}
