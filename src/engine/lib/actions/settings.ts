"use server";

import { prisma } from "../db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const rows = await prisma.globalSettings.findMany();
  const map: Record<string, unknown> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export async function getSetting(key: string) {
  const row = await prisma.globalSettings.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function setSetting(key: string, value: unknown) {
  await prisma.globalSettings.upsert({
    where: { key },
    update: { value: value as object },
    create: { key, value: value as object },
  });
  revalidatePath("/admin/settings");
}

export async function setSettings(data: Record<string, unknown>) {
  await prisma.$transaction(
    Object.entries(data).map(([key, value]) =>
      prisma.globalSettings.upsert({
        where: { key },
        update: { value: value as object },
        create: { key, value: value as object },
      })
    )
  );
  revalidatePath("/admin/settings");
}

export async function getDashboardStats() {
  const [totalPages, totalSections, totalMedia, totalLeads, totalForms] =
    await Promise.all([
      prisma.page.count(),
      prisma.section.count(),
      prisma.media.count(),
      prisma.lead.count(),
      prisma.form.count(),
    ]);

  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { form: { select: { name: true, slug: true } } },
  });

  return {
    totalPages,
    totalSections,
    totalMedia,
    totalLeads,
    totalForms,
    recentLeads,
  };
}
