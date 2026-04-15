"use server";

import { prisma } from "../db";
import {
  verifyPassword,
  createToken,
  setAuthCookie,
  removeAuthCookie,
  hashPassword,
} from "../auth";

export async function loginAction(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return { error: "Invalid credentials" };

  const valid = await verifyPassword(password, user.password);
  if (!valid) return { error: "Invalid credentials" };

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  await setAuthCookie(token);

  return { success: true };
}

export async function logoutAction() {
  await removeAuthCookie();
  return { success: true };
}

export async function createAdminUser(
  email: string,
  password: string,
  name: string
) {
  const hash = await hashPassword(password);
  return prisma.adminUser.create({
    data: { email, password: hash, name },
  });
}
