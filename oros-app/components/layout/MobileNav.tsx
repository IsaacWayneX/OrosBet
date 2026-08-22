import Link from "next/link";

export function MobileNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[min(92vw,480px)] -translate-x-1/2 items-center justify-between rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur lg:hidden">
      <Link href="/">Live</Link>
      <Link href="/matches">Matches</Link>
      <Link href="/positions">Positions</Link>
      <Link href="/wallet">Wallet</Link>
    </nav>
  );
}
