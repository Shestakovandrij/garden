"use server";

import { prisma } from "../db";
import { revalidatePath } from "next/cache";

export async function createSection(data: {
  pageId: string;
  type: string;
  schemaKey: string;
  label: string;
  data: Record<string, unknown>;
}) {
  const maxOrder = await prisma.section.aggregate({
    where: { pageId: data.pageId },
    _max: { sortOrder: true },
  });

  const section = await prisma.section.create({
    data: {
      pageId: data.pageId,
      type: data.type,
      schemaKey: data.schemaKey,
      label: data.label,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      data: data.data as object,
    },
  });

  revalidatePath(`/admin/pages/${data.pageId}`);
  return section;
}

export async function updateSection(
  id: string,
  data: {
    label?: string;
    visible?: boolean;
    sortOrder?: number;
    data?: Record<string, unknown>;
  }
) {
  const section = await prisma.section.update({
    where: { id },
    data: {
      ...(data.label !== undefined && { label: data.label }),
      ...(data.visible !== undefined && { visible: data.visible }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.data !== undefined && { data: data.data as object }),
    },
  });

  revalidatePath(`/admin/pages/${section.pageId}`);
  return section;
}

export async function deleteSection(id: string) {
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) return;

  await prisma.section.delete({ where: { id } });
  revalidatePath(`/admin/pages/${section.pageId}`);
}

export async function duplicateSection(id: string) {
  const original = await prisma.section.findUnique({ where: { id } });
  if (!original) return;

  const maxOrder = await prisma.section.aggregate({
    where: { pageId: original.pageId },
    _max: { sortOrder: true },
  });

  const section = await prisma.section.create({
    data: {
      pageId: original.pageId,
      type: original.type,
      schemaKey: original.schemaKey,
      schemaVersion: original.schemaVersion,
      label: `${original.label} (copy)`,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      visible: original.visible,
      data: original.data as object,
    },
  });

  revalidatePath(`/admin/pages/${original.pageId}`);
  return section;
}

export async function reorderSections(
  pageId: string,
  orderedIds: string[]
) {
  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.section.update({
        where: { id },
        data: { sortOrder: i },
      })
    )
  );
  revalidatePath(`/admin/pages/${pageId}`);
}
