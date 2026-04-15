"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsClient({
  initialSettings,
}: {
  initialSettings: Record<string, unknown>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const general = (initialSettings.general as Record<string, string>) || {};
  const [projectName, setProjectName] = useState(general.projectName || "");
  const [logo, setLogo] = useState(general.logo || "");
  const [contactEmail, setContactEmail] = useState(general.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(general.contactPhone || "");
  const [address, setAddress] = useState(general.address || "");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        general: { projectName, logo, contactEmail, contactPhone, address },
      }),
    });

    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input value={logo} onChange={(e) => setLogo(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="h-10 px-6 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
