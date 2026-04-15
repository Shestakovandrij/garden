import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/engine/lib/auth";

export async function POST() {
  await removeAuthCookie();
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
}
