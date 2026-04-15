import { NextRequest, NextResponse } from "next/server";
import { deleteForm } from "@/engine/lib/actions/leads";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteForm(id);
  return NextResponse.json({ success: true });
}
