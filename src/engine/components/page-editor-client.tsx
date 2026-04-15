"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContentPage, ContentSection, SectionSchema } from "@/engine/types";
import {
  createSection,
  deleteSection,
  duplicateSection,
  updateSection,
  reorderSections,
} from "@/engine/lib/actions/sections";
import { updatePage, updatePageSeo } from "@/engine/lib/actions/pages";
import { SectionEditorModal } from "./section-editor-modal";

interface PageEditorClientProps {
  page: ContentPage;
  schemas: SectionSchema[];
}

export function PageEditorClient({ page, schemas }: PageEditorClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Page meta state
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState(page.status);
  const [metaSaving, setMetaSaving] = useState(false);

  // SEO state
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState(page.seo?.title ?? "");
  const [seoDesc, setSeoDesc] = useState(page.seo?.metaDescription ?? "");
  const [seoOg, setSeoOg] = useState(page.seo?.ogImage ?? "");
  const [seoNoIndex, setSeoNoIndex] = useState(page.seo?.noIndex ?? false);
  const [seoSaving, setSeoSaving] = useState(false);

  // Section editor modal
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const editingSchema = editingSection
    ? schemas.find((s) => s.key === editingSection.schemaKey)
    : null;

  // Add section picker
  const [showAddSection, setShowAddSection] = useState(false);

  const sections = page.sections ?? [];

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleSaveMeta() {
    setMetaSaving(true);
    try {
      await updatePage(page.id, { title, slug, status });
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setMetaSaving(false);
    }
  }

  async function handleSaveSeo() {
    setSeoSaving(true);
    try {
      await updatePageSeo(page.id, {
        title: seoTitle,
        metaDescription: seoDesc,
        ogImage: seoOg,
        noIndex: seoNoIndex,
      });
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSeoSaving(false);
    }
  }

  async function handleToggleVisibility(section: ContentSection) {
    await updateSection(section.id, { visible: !section.visible });
    refresh();
  }

  async function handleDeleteSection(section: ContentSection) {
    if (!confirm(`Delete section "${section.label}"?`)) return;
    await deleteSection(section.id);
    refresh();
  }

  async function handleDuplicateSection(section: ContentSection) {
    await duplicateSection(section.id);
    refresh();
  }

  async function handleMoveSection(index: number, direction: "up" | "down") {
    const ids = sections.map((s) => s.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= ids.length) return;
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
    await reorderSections(page.id, ids);
    refresh();
  }

  async function handleAddSection(schema: SectionSchema) {
    await createSection({
      pageId: page.id,
      type: schema.key,
      schemaKey: schema.key,
      label: schema.label,
      data: { ...schema.defaultData },
    });
    setShowAddSection(false);
    refresh();
  }

  const inputClasses =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors";

  return (
    <div className="space-y-6">
      {/* Page meta */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className={inputClasses}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              className={inputClasses}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className={inputClasses}
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSaveMeta}
            disabled={metaSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {metaSaving ? "Saving..." : "Save Details"}
          </button>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setSeoOpen(!seoOpen)}
          className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-gray-400 transition-transform ${seoOpen ? "rotate-180" : ""}`}
          >
            <path d="M5 8l5 5 5-5" />
          </svg>
        </button>
        {seoOpen && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                className={inputClasses}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Page title for search engines..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                className={`${inputClasses} resize-y`}
                rows={2}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Brief description for search results..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
              <input
                type="text"
                className={inputClasses}
                value={seoOg}
                onChange={(e) => setSeoOg(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={seoNoIndex}
                onClick={() => setSeoNoIndex(!seoNoIndex)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  seoNoIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    seoNoIndex ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-gray-700">
                No Index (hide from search engines)
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveSeo}
                disabled={seoSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {seoSaving ? "Saving..." : "Save SEO"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sections list */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Sections
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({sections.length})
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setShowAddSection(!showAddSection)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Add Section
          </button>
        </div>

        {/* Add section picker */}
        {showAddSection && (
          <div className="mb-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Choose a section type to add:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {schemas.map((schema) => (
                <button
                  key={schema.key}
                  type="button"
                  onClick={() => handleAddSection(schema)}
                  className="text-left p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {schema.icon && <span className="text-lg">{schema.icon}</span>}
                    <span className="text-sm font-medium text-gray-900">
                      {schema.label}
                    </span>
                  </div>
                  {schema.description && (
                    <p className="text-xs text-gray-500 mt-1">{schema.description}</p>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAddSection(false)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Section items */}
        {sections.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No sections yet. Add one to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sections.map((section, i) => (
              <div
                key={section.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  section.visible
                    ? "border-gray-200 bg-white"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                {/* Drag handle / reorder */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveSection(i, "up")}
                    disabled={i === 0}
                    className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                    title="Move up"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l4-4 4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSection(i, "down")}
                    disabled={i === sections.length - 1}
                    className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                    title="Move down"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 5l4 4 4-4" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {section.label}
                    </span>
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      {section.schemaKey}
                    </span>
                    {!section.visible && (
                      <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(section)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded cursor-pointer"
                    title={section.visible ? "Hide section" : "Show section"}
                  >
                    {section.visible ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSection(section)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded cursor-pointer"
                    title="Edit section"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateSection(section)}
                    className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded cursor-pointer"
                    title="Duplicate section"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125H5.625a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H8.25m8.25 0H19.5a1.125 1.125 0 011.125 1.125v9a1.125 1.125 0 01-1.125 1.125h-1.5m-8.25-9v-3.375c0-.621.504-1.125 1.125-1.125h9a1.125 1.125 0 011.125 1.125v9c0 .621-.504 1.125-1.125 1.125h-3.375" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded cursor-pointer"
                    title="Delete section"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section editor modal */}
      {editingSection && editingSchema && (
        <SectionEditorModal
          section={editingSection}
          schema={editingSchema}
          onClose={() => setEditingSection(null)}
          onSaved={() => {
            setEditingSection(null);
            refresh();
          }}
        />
      )}

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          Refreshing...
        </div>
      )}
    </div>
  );
}
