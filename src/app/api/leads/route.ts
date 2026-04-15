import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/engine/lib/actions/leads";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { formSlug, values, source } = body;

  if (!formSlug || !values) {
    return NextResponse.json({ error: "formSlug and values required" }, { status: 400 });
  }

  const result = await createLead({
    formSlug,
    values,
    source: source || "website",
    ip: req.headers.get("x-forwarded-for") || undefined,
    userAgent: req.headers.get("user-agent") || undefined,
  });

  if ("error" in result) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json({ success: true, id: result.id });
}
