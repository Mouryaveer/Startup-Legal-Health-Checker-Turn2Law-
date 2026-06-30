import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadsDashboardClient } from "@/components/admin/leads-client";

export const metadata: Metadata = {
  title: "Leads & CRM | Turn2Law Admin",
  description: "Manage startup contacts, pipeline conversions, and outreach logs.",
};

async function getLeadsData() {
  try {
    const supabase = createAdminClient();
    
    // Fetch all leads
    const { data: leads, error } = await supabase
      .from("assessment_leads")
      .select("*, assessments(overall_score, risk_level, scores)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return leads || [];
  } catch (error) {
    console.error("Database error fetching CRM leads:", error);
    return null;
  }
}

export default async function AdminLeadsPage() {
  const leads = await getLeadsData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Leads & CRM Pipeline</h1>
        <p className="text-xs text-[#6B6B6B]">Convert diagnostic submissions into Turn2Law retainer relationships.</p>
      </div>

      <LeadsDashboardClient initialLeads={leads} />
    </div>
  );
}
export const dynamic = "force-dynamic";
