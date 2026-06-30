import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/assessment/wizard";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Startup Legal Assessment Wizard",
  description: "Assess your startup's compliance across incorporation, IP, employment, privacy policies, contracts and regulatory topics in 10 minutes.",
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEFCF9] via-white to-white pt-24 pb-16">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(216,160,76,0.04)_0%,transparent_50%)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF8EF] border border-[#E8D5B0] text-xs font-semibold text-[#8E5F28]">
            <Sparkles className="w-3.5 h-3.5 text-[#D8A04C]" />
            100% Confidential Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A]">
            Startup Legal Compliance Check
          </h1>
          <p className="text-sm sm:text-base text-[#6B6B6B]">
            Answer the following questions to the best of your knowledge. Your answers will generate a customized, prioritized legal roadmap.
          </p>
        </div>

        {/* Assessment Form Wizard */}
        <AssessmentWizard />
      </div>
    </div>
  );
}
