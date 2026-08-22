export function Skeleton({ className = "h-20 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/8 ${className}`} />;
}
