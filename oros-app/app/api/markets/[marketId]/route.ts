import { NextResponse } from "next/server";
import { getMarket } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ marketId: string }> }) {
  const { marketId } = await params;
  const market = await getMarket(marketId);
  if (!market) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ market });
}
