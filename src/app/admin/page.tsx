import { getDashboardStats } from "@/engine/lib/actions/settings";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Pages", value: stats.totalPages, icon: "📄", color: "bg-blue-50 text-blue-700" },
    { label: "Sections", value: stats.totalSections, icon: "🧩", color: "bg-purple-50 text-purple-700" },
    { label: "Media Files", value: stats.totalMedia, icon: "🖼️", color: "bg-green-50 text-green-700" },
    { label: "Leads", value: stats.totalLeads, icon: "📨", color: "bg-orange-50 text-orange-700" },
    { label: "Forms", value: stats.totalForms, icon: "📋", color: "bg-pink-50 text-pink-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
        </div>
        {stats.recentLeads.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">No leads yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.recentLeads.map((lead: any) => (
              <div key={lead.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {(lead.values as any)?.name || (lead.values as any)?.email || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{lead.form?.name || "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    lead.status === "new" ? "bg-green-100 text-green-700" :
                    lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {lead.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
