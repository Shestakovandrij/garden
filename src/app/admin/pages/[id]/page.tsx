export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageById } from "@/engine/lib/actions/pages";
import { registry } from "@/engine/schemas/registry";
import { PageEditorClient } from "@/engine/components/page-editor-client";
import type { ContentPage } from "@/engine/types";

export default async function AdminPageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPageById(id);

  if (!page) {
    notFound();
  }

  const schemas = registry.getAll();

  // Serialize the page data for the client component
  const serializedPage: ContentPage = {
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: page.status as "draft" | "published",
    sortOrder: page.sortOrder,
    seo: page.seo
      ? {
          id: page.seo.id,
          pageId: page.seo.pageId,
          title: page.seo.title ?? "",
          metaDescription: page.seo.metaDescription ?? "",
          ogImage: page.seo.ogImage ?? "",
          noIndex: page.seo.noIndex,
        }
      : null,
    sections: (page.sections ?? []).map((s) => ({
      id: s.id,
      pageId: s.pageId,
      type: s.type,
      schemaKey: s.schemaKey,
      schemaVersion: s.schemaVersion,
      label: s.label,
      sortOrder: s.sortOrder,
      visible: s.visible,
      data: s.data as Record<string, unknown>,
      createdAt: typeof s.createdAt === "string" ? s.createdAt : s.createdAt.toISOString(),
      updatedAt: typeof s.updatedAt === "string" ? s.updatedAt : s.updatedAt.toISOString(),
    })),
    createdAt: typeof page.createdAt === "string" ? page.createdAt : page.createdAt.toISOString(),
    updatedAt: typeof page.updatedAt === "string" ? page.updatedAt : page.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/admin/pages"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Pages
        </Link>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
          <path d="M5 3l4 4-4 4" />
        </svg>
        <span className="text-gray-900 font-medium">{page.title}</span>
      </div>

      {/* Client-side editor */}
      <PageEditorClient page={serializedPage} schemas={schemas} />
    </div>
  );
}
