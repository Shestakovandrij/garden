"use server";

import { prisma } from "../db";
import { revalidatePath } from "next/cache";

export async function getLeads(formId?: string) {
  return prisma.lead.findMany({
    where: formId ? { formId } : undefined,
    include: { form: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: { form: true },
  });
}

export async function createLead(data: {
  formSlug: string;
  values: Record<string, unknown>;
  source?: string;
  ip?: string;
  userAgent?: string;
}) {
  const form = await prisma.form.findUnique({
    where: { slug: data.formSlug },
  });
  if (!form) return { error: "Form not found" };

  const lead = await prisma.lead.create({
    data: {
      formId: form.id,
      values: data.values as object,
      source: data.source || "website",
      ip: data.ip,
      userAgent: data.userAgent,
    },
  });

  revalidatePath("/admin/leads");
  return lead;
}

export async function updateLeadStatus(id: string, status: string) {
  const lead = await prisma.lead.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/leads");
  return lead;
}

export async function deleteLead(id: string) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}

// ─── Forms ──────
export async function getForms() {
  return prisma.form.findMany({
    include: { _count: { select: { leads: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFormBySlug(slug: string) {
  return prisma.form.findUnique({ where: { slug } });
}

export async function createForm(data: {
  name: string;
  slug: string;
  fields: unknown[];
}) {
  const form = await prisma.form.create({
    data: {
      name: data.name,
      slug: data.slug,
      fields: data.fields as object,
    },
  });
  revalidatePath("/admin/forms");
  return form;
}

export async function updateForm(
  id: string,
  data: { name?: string; slug?: string; fields?: unknown[] }
) {
  const form = await prisma.form.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.fields && { fields: data.fields as object }),
    },
  });
  revalidatePath("/admin/forms");
  return form;
}

export async function deleteForm(id: string) {
  await prisma.form.delete({ where: { id } });
  revalidatePath("/admin/forms");
}
