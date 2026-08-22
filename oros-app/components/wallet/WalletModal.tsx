import { Modal } from "@/components/ui/Modal";

export function WalletModal({ open }: { open: boolean }) {
  return (
    <Modal open={open} title="Wallet actions">
      <p className="text-sm text-slate-300">Wallet modal placeholder for future connect, sign, and approve flows.</p>
    </Modal>
  );
}
