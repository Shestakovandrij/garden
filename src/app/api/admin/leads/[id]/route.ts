import { NextRequest, NextResponse } from "next/server";
import { updateLeadStatus, deleteLead } from "@/engine/lib/actions/leads";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json();
  await updateLeadStatus(id, status);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteLead(id);
  return NextResponse.json({ success: true });
}
