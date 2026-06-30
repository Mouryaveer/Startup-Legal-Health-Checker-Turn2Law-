import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { QuestionsListClient } from "@/components/admin/questions-client";
import { questions as defaultQuestions } from "@/lib/assessment/questions";

export const metadata: Metadata = {
  title: "Question Rules Management | Turn2Law Admin",
  description: "Create, edit, remove, and weight compliance evaluation rules.",
};

async function getQuestionsFromDb() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("DB questions empty or failed, loading default fallback questions.");
      return null;
    }
    return data;
  } catch (error) {
    console.error("Database error fetching rule questions:", error);
    return null;
  }
}

export default async function AdminQuestionsPage() {
  const dbQuestions = await getQuestionsFromDb();
  
  // Map db fields to match TS frontend if DB schema is slightly different
  const mappedQuestions = dbQuestions
    ? dbQuestions.map((q: any) => ({
        id: q.id,
        category: q.category_slug,
        categorySlug: q.category_slug,
        text: q.text,
        helpText: q.help_text,
        type: q.type,
        options: q.options,
        weight: q.weight,
        riskLevel: q.risk_level,
        industryDependent: q.industry_dependent,
        conditionalParentId: q.conditional_parent_id,
        conditionalValue: q.conditional_value,
        recommendation: q.recommendation,
      }))
    : defaultQuestions;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Compliance Rules Builder</h1>
        <p className="text-xs text-[#6B6B6B]">Add, modify, weight, and set sector-specific requirements without writing code.</p>
      </div>

      <QuestionsListClient initialQuestions={mappedQuestions} />
    </div>
  );
}
export const dynamic = "force-dynamic";
