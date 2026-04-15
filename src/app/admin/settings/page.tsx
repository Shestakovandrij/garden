export const dynamic = "force-dynamic";

import { getSettings } from "@/engine/lib/actions/settings";
import { SettingsClient } from "@/engine/components/settings-client";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Global Settings</h1>
      <SettingsClient initialSettings={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}
