export const dynamic = "force-dynamic";

import { getLeads } from "@/engine/lib/actions/leads";
import { LeadsClient } from "@/engine/components/leads-client";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Leads</h1>
      <LeadsClient initialLeads={JSON.parse(JSON.stringify(leads))} />
    </div>
  );
}
