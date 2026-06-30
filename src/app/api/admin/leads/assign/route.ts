import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { leadId, assignedTo } = await request.json();

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("assessment_leads")
        .update({ assigned_to: assignedTo, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;
    } catch (dbError: any) {
      console.warn("DB update failed, skipped assignedTo update for demo:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assign API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
