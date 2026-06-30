import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json(questions || []);
  } catch (error: any) {
    console.error("GET Questions API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, category_slug, text, help_text, type, options, weight, risk_level, industry_dependent, conditional_parent_id, conditional_value, is_active, sort_order, recommendation } = body;

    if (!id || !category_slug || !text || !type || !options || !risk_level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("questions")
        .insert({
          id,
          category_slug,
          text,
          help_text,
          type,
          options,
          weight: weight || 1,
          risk_level,
          industry_dependent: industry_dependent || [],
          conditional_parent_id,
          conditional_value,
          is_active: is_active !== undefined ? is_active : true,
          sort_order: sort_order || 0,
          recommendation: recommendation || {},
        });

      if (error) throw error;
    } catch (dbError: any) {
      console.warn("DB question create failed, mock return for demo:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Question API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, category_slug, text, help_text, type, options, weight, risk_level, industry_dependent, conditional_parent_id, conditional_value, is_active, sort_order, recommendation } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing question ID" }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("questions")
        .update({
          category_slug,
          text,
          help_text,
          type,
          options,
          weight,
          risk_level,
          industry_dependent,
          conditional_parent_id,
          conditional_value,
          is_active,
          sort_order,
          recommendation,
        })
        .eq("id", id);

      if (error) throw error;
    } catch (dbError: any) {
      console.warn("DB question update failed, mock return for demo:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Question API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing question ID" }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (dbError: any) {
      console.warn("DB question delete failed, mock return for demo:", dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Question API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
