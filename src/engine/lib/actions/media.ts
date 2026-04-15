"use server";

import { prisma } from "../db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function getMedia(folder?: string) {
  return prisma.media.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "general";
  const alt = (formData.get("alt") as string) || "";

  if (!file) return { error: "No file provided" };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name);
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filePath = path.join(uploadDir, safeName);

  await writeFile(filePath, buffer);

  const url = `/uploads/${folder}/${safeName}`;

  const media = await prisma.media.create({
    data: {
      url,
      filename: file.name,
      alt,
      mimeType: file.type,
      size: file.size,
      folder,
    },
  });

  revalidatePath("/admin/media");
  return media;
}

export async function updateMedia(
  id: string,
  data: { alt?: string; folder?: string }
) {
  const media = await prisma.media.update({ where: { id }, data });
  revalidatePath("/admin/media");
  return media;
}

export async function deleteMedia(id: string) {
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}
