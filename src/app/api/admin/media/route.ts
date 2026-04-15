import { NextRequest, NextResponse } from "next/server";
import { uploadMedia } from "@/engine/lib/actions/media";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = await uploadMedia(formData);
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
