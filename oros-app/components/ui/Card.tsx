import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface rounded-2xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.18)]", className)} {...props} />;
}
