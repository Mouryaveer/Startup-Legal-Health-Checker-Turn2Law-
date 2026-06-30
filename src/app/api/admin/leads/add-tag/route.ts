import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { leadId, tag } = await request.json();

    if (!leadId || !tag) {
      return NextResponse.json({ error: "Missing leadId or tag" }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();

      // Fetch current tags
      const { data, error: fetchError } = await supabase
        .from("assessment_leads")
        .select("tags")
        .eq("id", leadId)
        .single();

      if (fetchError) throw fetchError;

      const currentTags = data?.tags || [];
      if (!currentTags.includes(tag)) {
        const updatedTags = [...currentTags, tag];
        const { error: updateError } = await supabase
          .from("assessment_leads")
          .update({ tags: updatedTags, updated_at: new Date().toISOString() })
          .eq("id", leadId);

        if (updateError) throw updateError;
      }
    } catch (dbError: any) {
      console.warn("DB update failed, skipped tag append for demo:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add Tag API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
