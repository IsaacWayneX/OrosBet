import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className={cn("surface w-full max-w-lg rounded-2xl p-6")}> 
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
