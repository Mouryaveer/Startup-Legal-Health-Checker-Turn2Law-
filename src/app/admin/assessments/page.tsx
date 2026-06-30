import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { AssessmentsListClient } from "@/components/admin/assessments-client";

export const metadata: Metadata = {
  title: "Assessments Audit | Turn2Law Admin",
  description: "View and filter all legal health assessments.",
};

async function getAssessmentsData() {
  try {
    const supabase = createAdminClient();
    const { data: assessments, error } = await supabase
      .from("assessments")
      .select("*")
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return assessments || [];
  } catch (error) {
    console.error("Database error fetching assessments:", error);
    return null;
  }
}

export default async function AdminAssessmentsPage() {
  const data = await getAssessmentsData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">All Assessments</h1>
        <p className="text-xs text-[#6B6B6B]">Comprehensive list of all completed startup diagnostic checks.</p>
      </div>

      <AssessmentsListClient initialAssessments={data} />
    </div>
  );
}
export const dynamic = "force-dynamic";
