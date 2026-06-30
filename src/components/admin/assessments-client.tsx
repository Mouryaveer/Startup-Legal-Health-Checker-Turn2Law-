"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileCheck, 
  Search, 
  Calendar, 
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Assessment {
  id: string;
  company_name: string;
  company_email: string;
  overall_score: number;
  risk_level: string;
  completed_at: string;
}

interface AssessmentsListClientProps {
  initialAssessments: Assessment[] | null;
}

const mockAssessments: Assessment[] = [
  { id: "local-demo-1", company_name: "Aero Logistics", company_email: "ceo@aerolog.in", overall_score: 42, risk_level: "high", completed_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "local-demo-2", company_name: "Curate Health", company_email: "founders@curate.co", overall_score: 87, risk_level: "low", completed_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: "local-demo-3", company_name: "Zeta Pay", company_email: "sanjay@zetapay.com", overall_score: 59, risk_level: "medium", completed_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "local-demo-4", company_name: "Krypton Web3", company_email: "legal@krypton.io", overall_score: 31, risk_level: "critical", completed_at: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export function AssessmentsListClient({ initialAssessments }: AssessmentsListClientProps) {
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments && initialAssessments.length ? initialAssessments : mockAssessments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");

  const filtered = assessments.filter(a => {
    const matchesSearch = 
      a.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.company_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = filterRisk === "all" || a.risk_level === filterRisk;

    return matchesSearch && matchesRisk;
  });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-red-700 bg-red-50 border-red-200";
      case "high":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "medium":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-green-700 bg-green-50 border-green-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtering */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-2xl">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
          <input
            type="text"
            placeholder="Search company name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none focus:border-[#D8A04C] transition-all"
          />
        </div>

        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="h-10 px-3 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none focus:border-[#D8A04C] cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Risks</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Healthy / Low</option>
        </select>
      </div>

      {/* Table list */}
      <div className="glass-panel rounded-3xl p-6 overflow-hidden">
        <div className="overflow-x-auto border border-[#E8E1D5]/60 rounded-2xl bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FEFCF9] border-b border-[#E8E1D5]">
                <th className="p-4 font-bold text-[#3D3D3D]">Company Name</th>
                <th className="p-4 font-bold text-[#3D3D3D]">Founder Email</th>
                <th className="p-4 font-bold text-[#3D3D3D]">Compliance Score</th>
                <th className="p-4 font-bold text-[#3D3D3D]">Date Audited</th>
                <th className="p-4 font-bold text-[#3D3D3D] text-right">Report Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D5]/40">
              {filtered.map((ass) => (
                <tr key={ass.id} className="hover:bg-[#FEFCF9]/40 transition-colors">
                  <td className="p-4 font-semibold text-[#0A0A0A]">{ass.company_name}</td>
                  <td className="p-4 text-[#6B6B6B]">{ass.company_email}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full border text-[9px] font-bold capitalize",
                        getRiskBadgeColor(ass.risk_level)
                      )}>
                        {ass.risk_level}
                      </span>
                      <strong className="text-[#0A0A0A]">{ass.overall_score}%</strong>
                    </div>
                  </td>
                  <td className="p-4 text-[#9B9B9B]">{new Date(ass.completed_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/results/${ass.id}`}
                      className="inline-flex items-center gap-1 text-[#8E5F28] hover:text-[#D8A04C] font-semibold hover:underline"
                    >
                      <span>Open Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#6B6B6B]">
                    No audits found matching search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
