import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminDashboardClient } from "@/components/admin/dashboard-client";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Turn2Law Health Checker",
  description: "Assessments volume, score profiles, and categories failure maps.",
};

async function getDashboardData() {
  try {
    const supabase = createAdminClient();
    
    // Fetch total count of assessments
    const { count: totalAssessments, error: countError } = await supabase
      .from("assessments")
      .select("*", { count: "exact", head: true });

    // Fetch recent submissions
    const { data: recentSubmissions, error: submissionsError } = await supabase
      .from("assessments")
      .select("id, company_name, company_email, overall_score, risk_level, completed_at")
      .order("completed_at", { ascending: false })
      .limit(10);

    // Calculate average score
    const { data: scoresData, error: avgError } = await supabase
      .from("assessments")
      .select("overall_score");

    let averageScore = 0;
    if (scoresData && scoresData.length > 0) {
      const sum = scoresData.reduce((acc, curr) => acc + Number(curr.overall_score || 0), 0);
      averageScore = Math.round(sum / scoresData.length);
    }

    return {
      totalAssessments: totalAssessments || 0,
      recentSubmissions: recentSubmissions || [],
      averageScore: averageScore || 0,
    };
  } catch (error) {
    console.error("Database error fetching admin dashboard data:", error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Analytics Dashboard</h1>
        <p className="text-xs text-[#6B6B6B]">Operational overview, diagnostics trends, and recent user activity.</p>
      </div>

      <AdminDashboardClient initialData={data} />
    </div>
  );
}
export const dynamic = "force-dynamic";
