import { NextRequest, NextResponse } from "next/server";
import { setSettings } from "@/engine/lib/actions/settings";

export async function POST(req: NextRequest) {
  const data = await req.json();
  await setSettings(data);
  return NextResponse.json({ success: true });
}
