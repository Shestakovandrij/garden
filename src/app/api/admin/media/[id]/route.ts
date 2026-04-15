import { NextRequest, NextResponse } from "next/server";
import { deleteMedia } from "@/engine/lib/actions/media";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteMedia(id);
  return NextResponse.json({ success: true });
}
