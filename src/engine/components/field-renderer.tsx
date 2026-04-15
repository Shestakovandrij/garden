"use client";

import { useState } from "react";
import type { FieldDefinition } from "@/engine/types";

interface FieldRendererProps {
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  depth?: number;
}

export function FieldRenderer({ field, value, onChange, depth = 0 }: FieldRendererProps) {
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const inputClasses =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors";
  const helpClasses = "mt-1 text-xs text-gray-400";

  const indentClass = depth > 0 ? "pl-4 border-l-2 border-gray-200" : "";

  function renderField() {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            className={inputClasses}
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "textarea":
        return (
          <textarea
            className={`${inputClasses} resize-y`}
            rows={3}
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "richtext":
        return (
          <textarea
            className={`${inputClasses} resize-y font-mono`}
            rows={6}
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "image":
        return (
          <div className="space-y-2">
            {value && typeof value === "string" && value.length > 0 && (
              <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="text"
              className={inputClasses}
              value={value ?? ""}
              placeholder={field.placeholder ?? "Image URL..."}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            className={inputClasses}
            value={value ?? ""}
            min={field.min}
            max={field.max}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
        );

      case "boolean":
        return (
          <button
            type="button"
            role="switch"
            aria-checked={!!value}
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              value ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                value ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        );

      case "select":
        return (
          <select
            className={inputClasses}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "link":
        return (
          <input
            type="url"
            className={inputClasses}
            value={value ?? ""}
            placeholder={field.placeholder ?? "https://..."}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "color":
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-1 bg-white"
              value={value ?? "#000000"}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              className={`${inputClasses} max-w-[140px]`}
              value={value ?? ""}
              placeholder="#000000"
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );

      case "list":
        return <ListField value={value} onChange={onChange} placeholder={field.placeholder} />;

      case "repeater":
        return (
          <RepeaterField
            field={field}
            value={value}
            onChange={onChange}
            depth={depth}
          />
        );

      case "object":
        return (
          <ObjectField
            field={field}
            value={value}
            onChange={onChange}
            depth={depth}
          />
        );

      case "gallery":
        return <ListField value={value} onChange={onChange} placeholder={field.placeholder ?? "Image URL..."} />;

      default:
        return (
          <input
            type="text"
            className={inputClasses}
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  }

  return (
    <div className={`${indentClass} space-y-1`}>
      {field.type !== "boolean" ? (
        <label className={labelClasses}>
          {field.label}
          {field.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      ) : (
        <div className="flex items-center gap-3">
          {renderField()}
          <label className="text-sm font-medium text-gray-700 cursor-pointer">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        </div>
      )}
      {field.type !== "boolean" && renderField()}
      {field.helpText && <p className={helpClasses}>{field.helpText}</p>}
    </div>
  );
}

/* ─── List (array of strings) ─── */
function ListField({
  value,
  onChange,
  placeholder,
}: {
  value: any;
  onChange: (v: any) => void;
  placeholder?: string;
}) {
  const items: string[] = Array.isArray(value) ? value : [];

  function update(index: number, text: string) {
    const next = [...items];
    next[index] = text;
    onChange(next);
  }

  function add() {
    onChange([...items, ""]);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-5 text-right shrink-0">{i + 1}.</span>
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
            value={item}
            placeholder={placeholder}
            onChange={(e) => update(i, e.target.value)}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Remove"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
      >
        + Add item
      </button>
    </div>
  );
}

/* ─── Repeater (array of objects with sub-fields) ─── */
function RepeaterField({
  field,
  value,
  onChange,
  depth,
}: {
  field: FieldDefinition;
  value: any;
  onChange: (v: any) => void;
  depth: number;
}) {
  const items: Record<string, unknown>[] = Array.isArray(value) ? value : [];
  const subFields = field.fields ?? [];

  function updateItem(index: number, updated: Record<string, unknown>) {
    const next = [...items];
    next[index] = updated;
    onChange(next);
  }

  function addItem() {
    const blank: Record<string, unknown> = {};
    for (const f of subFields) {
      blank[f.key] = f.defaultValue ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "");
    }
    onChange([...items, blank]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Item {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
            >
              Remove
            </button>
          </div>
          {subFields.map((sf) => (
            <FieldRenderer
              key={sf.key}
              field={sf}
              value={item[sf.key]}
              onChange={(v) => updateItem(i, { ...item, [sf.key]: v })}
              depth={depth + 1}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3v10M3 8h10" />
        </svg>
        Add item
      </button>
    </div>
  );
}

/* ─── Object (nested sub-fields) ─── */
function ObjectField({
  field,
  value,
  onChange,
  depth,
}: {
  field: FieldDefinition;
  value: any;
  onChange: (v: any) => void;
  depth: number;
}) {
  const obj: Record<string, unknown> = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const subFields = field.fields ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-4">
      {subFields.map((sf) => (
        <FieldRenderer
          key={sf.key}
          field={sf}
          value={obj[sf.key]}
          onChange={(v) => onChange({ ...obj, [sf.key]: v })}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
