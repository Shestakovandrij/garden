"use client";

import { useState } from "react";
import type { SectionSchema, ContentSection } from "@/engine/types";
import { FieldRenderer } from "./field-renderer";
import { updateSection } from "@/engine/lib/actions/sections";

interface SectionEditorModalProps {
  section: ContentSection;
  schema: SectionSchema;
  onClose: () => void;
  onSaved: () => void;
}

export function SectionEditorModal({
  section,
  schema,
  onClose,
  onSaved,
}: SectionEditorModalProps) {
  const [data, setData] = useState<Record<string, unknown>>({ ...section.data });
  const [label, setLabel] = useState(section.label);
  const [saving, setSaving] = useState(false);

  function updateField(key: string, value: unknown) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateSection(section.id, { label, data });
      onSaved();
    } catch (err) {
      console.error("Failed to save section:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-2xl my-8 mx-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Section
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {schema.label}
                {schema.description && ` — ${schema.description}`}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Section label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Label
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Section label..."
              />
            </div>

            <hr className="border-gray-100" />

            {/* Schema fields */}
            {schema.fields.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={data[field.key]}
                onChange={(v) => updateField(field.key, v)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
