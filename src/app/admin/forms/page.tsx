export const dynamic = "force-dynamic";

import { getForms } from "@/engine/lib/actions/leads";
import { FormsClient } from "@/engine/components/forms-client";

export default async function FormsPage() {
  const forms = await getForms();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Forms</h1>
      <FormsClient initialForms={JSON.parse(JSON.stringify(forms))} />
    </div>
  );
}
