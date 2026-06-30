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
  CheckCircle2, 
  Briefcase,
  ChevronDown,
  Activity,
  Award,
  ShieldCheck,
  FileX,
  FileText,
  BadgeAlert,
  ArrowUpRight
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
  const [activeRecTab, setActiveRecTab] = useState<"critical" | "high" | "medium">("critical");

  const criticalRisksCount = results.risks.filter(r => r.riskLevel === "critical" || r.riskLevel === "high").length;
  
  const handlePrintPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      window.print();
      setIsDownloading(false);
    }, 500);
  };

  const getMaturityColor = (maturity: string) => {
    if (maturity === "Series-A Ready") return "bg-green-50 text-green-700 border-green-200";
    if (maturity === "Seed Ready") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  // Filter risks by tab
  const tabRisks = results.risks.filter(r => {
    if (activeRecTab === "critical") return r.riskLevel === "critical";
    if (activeRecTab === "high") return r.riskLevel === "high";
    return r.riskLevel === "medium" || r.riskLevel === "low";
  });

  return (
    <div className="space-y-12 pb-24 print:bg-white print:text-black">
      {/* Printable Score summary sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-[#FEFCF9] border border-[#E8E1D5] rounded-3xl p-6 sm:p-10 relative overflow-hidden print:border-none print:bg-white print:p-0">
        <div className="lg:col-span-2 space-y-5 print:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF8EF] border border-[#E8D5B0] text-xs font-semibold text-[#8E5F28] print:hidden">
              <Activity className="w-3.5 h-3.5 text-[#D8A04C]" />
              Compliance Assessment Report
            </span>
            <span className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold capitalize",
              getMaturityColor(results.complianceMaturity)
            )}>
              {results.complianceMaturity}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A]">
            Legal Health Audit for {companyName}
          </h1>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed max-w-xl">
            Our diagnostic analysis identifies {criticalRisksCount} critical compliance issues requiring immediate mitigation. Below is your detailed compliance audit and recommended remediation roadmap.
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

      {/* Strengths & Weaknesses Panel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-700">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0A0A0A]">Compliance Strengths</h3>
          </div>
          <ul className="space-y-3">
            {results.strengths.map((str, idx) => (
              <li key={idx} className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#3D3D3D]">{str.title}</h4>
                  <p className="text-[10px] text-[#6B6B6B] mt-0.5">{str.description}</p>
                </div>
              </li>
            ))}
            {results.strengths.length === 0 && (
              <p className="text-xs text-[#6B6B6B]">No strengths identified yet. Address compliance gaps to build strength parameters.</p>
            )}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-600">
            <BadgeAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0A0A0A]">Compliance Vulnerabilities</h3>
          </div>
          <ul className="space-y-3">
            {results.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex gap-2.5 items-start">
                <FileX className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#3D3D3D]">{weak.title}</h4>
                  <p className="text-[10px] text-[#6B6B6B] mt-0.5">{weak.description}</p>
                </div>
              </li>
            ))}
            {results.weaknesses.length === 0 && (
              <p className="text-xs text-green-600 font-semibold">Excellent! No compliance vulnerabilities identified.</p>
            )}
          </ul>
        </div>
      </section>

      {/* Missing Legal Documents Checklist */}
      <section className="glass-panel-strong rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#8E5F28]" />
          <div>
            <h3 className="text-base font-bold text-[#0A0A0A]">Missing Legal Documents Checklist</h3>
            <p className="text-[11px] text-[#6B6B6B]">Essential legal documents that your startup needs to draft immediately.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {["Certificate of Incorporation", "Shareholders' Agreement (SHA)", "Founder Vesting Agreement", "IP Assignment Agreements", "POSH Policy Document", "DPDP Compliant Website Privacy Policy"].map((doc) => {
            const isMissing = results.missingDocuments.includes(doc);
            return (
              <div 
                key={doc} 
                className={cn(
                  "p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium transition-colors",
                  isMissing 
                    ? "border-red-200 bg-red-50/30 text-red-800" 
                    : "border-green-200 bg-green-50/30 text-green-800"
                )}
              >
                <div className={cn(
                  "w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold",
                  isMissing ? "border-red-400 text-red-600 bg-white" : "border-green-400 text-white bg-green-600"
                )}>
                  {isMissing ? "✗" : "✓"}
                </div>
                <span>{doc}</span>
              </div>
            );
          })}
        </div>
      </section>

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#8E5F28]" />
              <h2 className="text-xl font-bold text-[#0A0A0A]">Prioritized Remediation Roadmap</h2>
            </div>
            
            {/* Tabs selector */}
            <div className="flex bg-[#F5F1EB] p-1 rounded-xl border border-[#E8E1D5] text-xs">
              {(["critical", "high", "medium"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveRecTab(tab)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer",
                    activeRecTab === tab 
                      ? "bg-white text-red-600 shadow-sm font-extrabold" 
                      : "text-[#6B6B6B] hover:text-[#0A0A0A]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3" role="list">
            {tabRisks.map((risk, index) => {
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
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus-ring-gold rounded-2xl"
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
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 space-y-4 border-t border-[#E8E1D5]/40 animate-reveal-up">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
                        <div className="md:col-span-2 space-y-4">
                          <div className="space-y-1.5">
                            <strong className="text-xs font-bold text-[#8E5F28] uppercase tracking-wider block">Why it matters:</strong>
                            <p className="text-xs sm:text-sm text-[#3D3D3D] leading-relaxed">{risk.whyItMatters}</p>
                          </div>
                          <div className="space-y-1.5">
                            <strong className="text-xs font-bold text-red-600 uppercase tracking-wider block">Business Impact:</strong>
                            <p className="text-xs sm:text-sm text-[#3D3D3D] leading-relaxed">{risk.businessImpact}</p>
                          </div>
                          <div className="space-y-1.5">
                            <strong className="text-xs font-bold text-green-600 uppercase tracking-wider block">Suggested Next Step:</strong>
                            <p className="text-xs sm:text-sm text-[#3D3D3D] leading-relaxed">{risk.nextStep}</p>
                          </div>
                        </div>

                        {/* Recommendation Side Card */}
                        <div className="md:col-span-1 bg-[#FDF8EF] border border-[#E8D5B0] p-4 rounded-xl flex flex-col justify-between space-y-4 h-full">
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="text-[#8E5F28] font-semibold block">Complexity:</span>
                              <strong className="capitalize text-[#0A0A0A] font-bold text-sm block">{risk.estimatedEffort}</strong>
                            </div>
                            <div>
                              <span className="text-[#8E5F28] font-semibold block">Target SLA:</span>
                              <strong className="text-[#0A0A0A] font-bold text-sm block">Immediate Action</strong>
                            </div>
                          </div>
                          <a
                            href={risk.serviceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3 bg-[#0A0A0A] hover:bg-[#D8A04C] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Resolve with Turn2Law</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {tabRisks.length === 0 && (
              <p className="text-center py-6 text-xs text-[#6B6B6B] border border-dashed border-[#E8E1D5] rounded-2xl">
                No active recommendations in the {activeRecTab} category.
              </p>
            )}
          </div>
        </section>
      ) : (
        <div className="glass-panel rounded-3xl p-8 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
            <CheckCircle2 className="w-6 h-6" />
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
            href={`mailto:${SITE_CONFIG.email}?subject=Legal Health Remediation Request&body=Hi Turn2Law Team, we completed our compliance check and got a score of ${results.overallScore} (${results.complianceMaturity}). We'd like to schedule a remediation review.`}
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
