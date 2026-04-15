"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/engine/lib/actions/pages";

export function CreatePageForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    // Auto-generate slug from title
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    await createPage({ title: title.trim(), slug: slug.trim() });
    setTitle("");
    setSlug("");
    setOpen(false);
    startTransition(() => {
      router.refresh();
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3v10M3 8h10" />
        </svg>
        New Page
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Create New Page</h2>
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Title
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My Landing Page"
            autoFocus
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 font-mono placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-landing-page"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending || !title.trim() || !slug.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setTitle("");
              setSlug("");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
