import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "warning" | "danger";
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  const tones = {
    default: "bg-white/8 text-slate-200",
    success: "bg-emerald-500/16 text-emerald-300",
    warning: "bg-amber-500/16 text-amber-300",
    danger: "bg-rose-500/16 text-rose-300",
  };

  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)} {...props} />;
}
