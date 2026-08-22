import { NextResponse } from "next/server";
import { getPortfolio, getPositions } from "@/lib/api";

export async function GET() {
  const [positions, portfolio] = await Promise.all([getPositions(), getPortfolio()]);
  return NextResponse.json({ positions, portfolio, source: "backend" });
}
