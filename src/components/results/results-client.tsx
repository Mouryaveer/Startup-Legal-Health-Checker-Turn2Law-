"use client";

import { useState } from "react";
import type { AssessmentResult } from "@/lib/assessment/scoring";
import { CircularGauge } from "@/components/ui/circular-gauge";
import { CategoryBreakdown } from "@/components/results/category-breakdown";
import { RiskMatrix } from "@/components/results/risk-matrix";
import { 
  Download, 
  Calendar, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Briefcase,
  ChevronDown,
  Activity,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants/seo";

interface ResultsClientProps {
  results: AssessmentResult;
  companyName: string;
}

export function ResultsClient({ results, companyName }: ResultsClientProps) {
  const [openRecommendationIndex, setOpenRecommendationIndex] = useState<number | null>(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const criticalRisksCount = results.risks.filter(r => r.riskLevel === "critical" || r.riskLevel === "high").length;
  
  const handlePrintPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      window.print();
      setIsDownloading(false);
    }, 500);
  };

  return (
    <div className="space-y-12 pb-24 print:bg-white print:text-black">
      {/* Printable Score summary sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-[#FEFCF9] border border-[#E8E1D5] rounded-3xl p-6 sm:p-10 relative overflow-hidden print:border-none print:bg-white print:p-0">
        <div className="lg:col-span-2 space-y-5 print:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF8EF] border border-[#E8D5B0] text-xs font-semibold text-[#8E5F28] print:hidden">
            <Activity className="w-3.5 h-3.5 text-[#D8A04C]" />
            Compliance Assessment Report
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A]">
            Legal Health Audit for {companyName}
          </h1>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed max-w-xl">
            Our diagnostic analysis identifies {criticalRisksCount} critical compliance issues requiring immediate mitigation. Below is your detailed compliance audit and recommended remediation steps.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 print:hidden">
            <button
              onClick={handlePrintPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white gold-gradient-bg rounded-xl hover:shadow-md transition-all active:scale-98 cursor-pointer focus-ring-gold"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Generating PDF..." : "Download Audit Report"}
            </button>
            <a
              href="#book-consultation"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#6B6B6B] bg-white border border-[#E8E1D5] rounded-xl hover:border-[#D8A04C]/30 hover:bg-[#FDF8EF] transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Book Free Compliance Review
            </a>
          </div>
        </div>

        {/* Circular Gauge Score */}
        <div className="lg:col-span-1 flex justify-center">
          <CircularGauge score={results.overallScore} size={220} strokeWidth={14} />
        </div>
      </div>

      {/* Category Breakdowns */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#8E5F28]" />
          <h2 className="text-xl font-bold text-[#0A0A0A]">Functional Compliance Summary</h2>
        </div>
        <CategoryBreakdown categoryScores={results.categoryScores} />
      </section>

      {/* Risk Grid */}
      {results.risks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#8E5F28]" />
            <h2 className="text-xl font-bold text-[#0A0A0A]">Interactive Risk Matrix</h2>
          </div>
          <RiskMatrix risks={results.risks} />
        </section>
      )}

      {/* Actionable recommendations timeline */}
      {results.risks.length > 0 ? (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#8E5F28]" />
            <h2 className="text-xl font-bold text-[#0A0A0A]">Prioritized Remediation Roadmap</h2>
          </div>

          <div className="space-y-3" role="list">
            {results.risks.map((risk, index) => {
              const isOpen = openRecommendationIndex === index;
              return (
                <div
                  key={risk.questionId}
                  className={cn(
                    "rounded-2xl border transition-all duration-300",
                    isOpen
                      ? "border-[#D8A04C]/30 bg-[#FEFCF9] shadow-[0_4px_20px_rgba(216,160,76,0.05)]"
                      : "border-[#E8E1D5] bg-white hover:border-[#D8A04C]/20"
                  )}
                  role="listitem"
                >
                  <button
                    onClick={() => setOpenRecommendationIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left focus-ring-gold rounded-2xl"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span className={cn(
                        "text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                        risk.riskLevel === "critical" ? "bg-red-50 text-red-600 border border-red-200" :
                        risk.riskLevel === "high" ? "bg-orange-50 text-orange-600 border border-orange-200" :
                        risk.riskLevel === "medium" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                        "bg-green-50 text-green-600 border border-green-200"
                      )}>
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-xs text-[#6B6B6B] block uppercase tracking-wider font-semibold">
                          {risk.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#0A0A0A] mt-0.5 leading-snug">
                          {risk.questionText}
                        </h3>
                      </div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-[#9B9B9B] transition-transform duration-200", isOpen && "rotate-180")} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 space-y-4 border-t border-[#E8E1D5]/40 animate-reveal-up">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#8E5F28] uppercase tracking-wider block">Recommended Action:</span>
                        <p className="text-sm text-[#3D3D3D] leading-relaxed">
                          {risk.recommendation}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-[#6B6B6B]">
                        <span className="flex items-center gap-1.5">
                          Risk severity: <strong className="capitalize text-red-600 font-bold">{risk.riskLevel}</strong>
                        </span>
                        <span className="flex items-center gap-1.5">
                          Implementation complexity: <strong className="capitalize text-[#0A0A0A] font-bold">{risk.estimatedEffort}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="glass-panel rounded-3xl p-8 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0A0A0A]">Perfect Score!</h3>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            Your startup satisfies all evaluated legal criteria. Keep tracking your compliance health quarterly to stay clean.
          </p>
        </div>
      )}

      {/* Book a consultation box */}
      <section
        id="book-consultation"
        className="glass-panel-strong rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden space-y-6 print:hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full bg-[#D8A04C]/5 pointer-events-none" />
        
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">
            Remediate Risks with Turn2Law
          </h2>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            Schedule a free 20-minute diagnostic session with our startup legal specialists to build a plan for drafting shareholder agreements, filings, privacy compliance, and employment contracts.
          </p>
        </div>

        <div>
          <a
            href={`mailto:${SITE_CONFIG.email}?subject=Legal Health Remediation Request&body=Hi Turn2Law Team, we completed our compliance check and got a score of ${results.overallScore}. We'd like to schedule a remediation review.`}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white gold-gradient-bg rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-102 focus-ring-gold cursor-pointer"
          >
            Schedule Free Compliance Call
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-[#9B9B9B]">
          Pre-filled with your score · 100% free consult
        </p>
      </section>
    </div>
  );
}
