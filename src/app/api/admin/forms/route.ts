import { NextRequest, NextResponse } from "next/server";
import { createForm } from "@/engine/lib/actions/leads";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const form = await createForm(data);
  return NextResponse.json(form);
}
