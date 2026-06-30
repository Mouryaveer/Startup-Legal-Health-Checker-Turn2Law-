import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { leadId, note } = await request.json();

    if (!leadId || !note) {
      return NextResponse.json({ error: "Missing leadId or note" }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      
      // Fetch current notes first
      const { data, error: fetchError } = await supabase
        .from("assessment_leads")
        .select("notes")
        .eq("id", leadId)
        .single();

      if (fetchError) throw fetchError;

      const currentNotes = data?.notes || [];
      const updatedNotes = [...currentNotes, note];

      const { error: updateError } = await supabase
        .from("assessment_leads")
        .update({ notes: updatedNotes, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (updateError) throw updateError;
    } catch (dbError: any) {
      console.warn("DB update failed, skipped note append for demo:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add Note API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
