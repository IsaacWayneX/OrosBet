import { NextResponse } from "next/server";
import { claimFaucet } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await claimFaucet(body.address);
  return NextResponse.json(result);
}
