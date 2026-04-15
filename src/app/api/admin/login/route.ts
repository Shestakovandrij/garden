import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/engine/lib/db";
import { verifyPassword, createToken, setAuthCookie } from "@/engine/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await verifyPassword(password, user.password);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await createToken({ userId: user.id, email: user.email, role: user.role });
  await setAuthCookie(token);

  return NextResponse.json({ success: true });
}
