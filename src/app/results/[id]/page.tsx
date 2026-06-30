import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ResultsClient } from "@/components/results/results-client";
import { LocalResultsClient } from "@/components/results/local-results-client";
import type { AssessmentResult } from "@/lib/assessment/scoring";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Compliance Audit Results | Turn2Law`,
    description: `Detailed startup compliance report and prioritized remediation roadmap. ID: ${id}`,
  };
}

async function fetchAssessmentFromDb(id: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.warn(`Database record ${id} not found:`, error?.message);
      return null;
    }

    return {
      scores: data.scores as AssessmentResult,
      companyName: data.company_name as string,
    };
  } catch (err) {
    console.error("Database connection error fetching assessment:", err);
    return null;
  }
}

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params;

  // Check if this is a locally generated assessment (for demo/fallback offline usage)
  if (id.startsWith("local-")) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FEFCF9] via-white to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LocalResultsClient localId={id} />
        </div>
      </div>
    );
  }

  // Fetch assessment from database
  const assessment = await fetchAssessmentFromDb(id);

  if (!assessment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEFCF9] via-white to-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResultsClient results={assessment.scores} companyName={assessment.companyName} />
      </div>
    </div>
  );
}
