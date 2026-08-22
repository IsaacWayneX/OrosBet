import { NextResponse } from "next/server";
import { createMarket, getMarkets } from "@/lib/api";

export async function GET() {
  const markets = await getMarkets();
  return NextResponse.json({ markets, source: "backend" });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createMarket(body);
  return NextResponse.json(result, { status: 201 });
}
