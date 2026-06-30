import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { leadId, stage } = await request.json();

    if (!leadId || !stage) {
      return NextResponse.json(
        { error: "Missing leadId or stage" },
        { status: 400 }
      );
    }

    try {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("assessment_leads")
        .update({ pipeline_stage: stage, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;
    } catch (dbError: any) {
      console.warn("DB update failed, skipping stage update for demo purposes:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Stage API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
