"use server";

import { prisma } from "../db";
import { revalidatePath } from "next/cache";

export async function getPages() {
  return prisma.page.findMany({
    include: { seo: true, _count: { select: { sections: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPageById(id: string) {
  return prisma.page.findUnique({
    where: { id },
    include: {
      seo: true,
      sections: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      seo: true,
      sections: {
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function createPage(data: {
  title: string;
  slug: string;
  status?: string;
}) {
  const page = await prisma.page.create({
    data: {
      title: data.title,
      slug: data.slug,
      status: data.status || "draft",
      seo: { create: { title: data.title } },
    },
    include: { seo: true },
  });
  revalidatePath("/admin/pages");
  return page;
}

export async function updatePage(
  id: string,
  data: { title?: string; slug?: string; status?: string; sortOrder?: number }
) {
  const page = await prisma.page.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${id}`);
  return page;
}

export async function updatePageSeo(
  pageId: string,
  data: {
    title?: string;
    metaDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
  }
) {
  return prisma.pageSeo.upsert({
    where: { pageId },
    update: data,
    create: { pageId, ...data },
  });
}

export async function deletePage(id: string) {
  await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
}
