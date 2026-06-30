import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, scores, companyName, companyEmail } = body;

    if (!answers || !scores || !companyName || !companyEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const supabase = createAdminClient();
      
      // Store in DB
      const { data, error } = await supabase
        .from("assessments")
        .insert({
          company_name: companyName,
          company_email: companyEmail,
          answers,
          scores,
          overall_score: scores.overallScore,
          risk_level: scores.overallRiskLevel,
          completed_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      // Automatically store as Lead in DB
      await supabase.from("assessment_leads").insert({
        assessment_id: data.id,
        company_name: companyName,
        email: companyEmail,
        pipeline_stage: "new",
      });

      return NextResponse.json({ id: data.id });
    } catch (dbError: any) {
      console.warn("Database storage failed, falling back to mock response for demo:", dbError.message);
      // Return generated UUID for mock/offline purposes
      const mockUuid = crypto.randomUUID();
      return NextResponse.json({ id: `local-${mockUuid}` });
    }
  } catch (error: any) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
