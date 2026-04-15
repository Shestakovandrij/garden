"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  formId: string;
  values: Record<string, unknown>;
  status: string;
  source: string;
  createdAt: string;
  form?: { name: string; slug: string };
}

const STATUS_OPTIONS = ["new", "contacted", "converted", "archived"];

export function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const statusColor: Record<string, string> = {
    new: "bg-green-100 text-green-700",
    contacted: "bg-blue-100 text-blue-700",
    converted: "bg-purple-100 text-purple-700",
    archived: "bg-gray-100 text-gray-600",
  };

  if (initialLeads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
        No leads yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {initialLeads.map((lead) => (
          <div key={lead.id}>
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
            >
              <div className="flex items-center gap-4">
                <span className="text-lg">📨</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {String(lead.values?.name || lead.values?.email || lead.values?.contact || "Lead")}
                  </p>
                  <p className="text-xs text-gray-500">{lead.form?.name || "Unknown form"} · {lead.source}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={lead.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor[lead.status] || "bg-gray-100"}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="text-xs text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                  className="text-red-400 hover:text-red-600 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            {expanded === lead.id && (
              <div className="px-6 pb-4 bg-gray-50">
                <div className="rounded-lg bg-white border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Submitted Data</p>
                  <dl className="space-y-2">
                    {Object.entries(lead.values).map(([key, val]) => (
                      <div key={key} className="flex gap-4">
                        <dt className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">{key}</dt>
                        <dd className="text-sm text-gray-900">{String(val)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
