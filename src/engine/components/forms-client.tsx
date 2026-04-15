"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormItem {
  id: string;
  name: string;
  slug: string;
  fields: { name: string; label: string; type: string; required?: boolean }[];
  _count?: { leads: number };
  createdAt: string;
}

export function FormsClient({ initialForms }: { initialForms: FormItem[] }) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "message", label: "Message", type: "textarea" },
        ],
      }),
    });
    setName("");
    setSlug("");
    setShowCreate(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this form and all its leads?")) return;
    await fetch(`/api/admin/forms/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 h-10 px-5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 cursor-pointer"
        >
          + New Form
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm" placeholder="Contact Form" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm" placeholder="contact" />
          </div>
          <button type="submit" className="h-10 px-5 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer">Create</button>
        </form>
      )}

      {initialForms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">No forms yet</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Slug</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fields</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Leads</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{form.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{form.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{form.fields?.length || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{form._count?.leads || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(form.id)} className="text-red-400 hover:text-red-600 text-sm cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
