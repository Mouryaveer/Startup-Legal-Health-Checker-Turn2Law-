"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Tag, 
  ArrowRight,
  Filter,
  CheckCircle,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  company_name: string;
  email: string;
  phone?: string;
  founder_name?: string;
  pipeline_stage: "new" | "contacted" | "qualified" | "proposal" | "client" | "lost";
  created_at: string;
  assessments?: {
    overall_score: number;
    risk_level: string;
  };
}

interface LeadsDashboardClientProps {
  initialLeads: Lead[] | null;
}

const mockLeads: Lead[] = [
  {
    id: "lead-1",
    company_name: "Aero Logistics",
    email: "ceo@aerolog.in",
    founder_name: "Rohan Varma",
    phone: "+91 98123 45678",
    pipeline_stage: "new",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    assessments: { overall_score: 42, risk_level: "high" }
  },
  {
    id: "lead-2",
    company_name: "Curate Health",
    email: "founders@curate.co",
    founder_name: "Dr. Priya Sen",
    phone: "+91 99234 56789",
    pipeline_stage: "contacted",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    assessments: { overall_score: 87, risk_level: "low" }
  },
  {
    id: "lead-3",
    company_name: "Zeta Pay",
    email: "sanjay@zetapay.com",
    founder_name: "Sanjay Singhal",
    phone: "+91 97345 67890",
    pipeline_stage: "qualified",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    assessments: { overall_score: 59, risk_level: "medium" }
  },
  {
    id: "lead-4",
    company_name: "Krypton Web3",
    email: "legal@krypton.io",
    founder_name: "Vikram Aditya",
    phone: "+91 96456 78901",
    pipeline_stage: "client",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    assessments: { overall_score: 31, risk_level: "critical" }
  }
];

export function LeadsDashboardClient({ initialLeads }: LeadsDashboardClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads && initialLeads.length ? initialLeads : mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  const handleStageChange = async (leadId: string, newStage: Lead["pipeline_stage"]) => {
    // Optimistic UI update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipeline_stage: newStage } : l));

    try {
      await fetch("/api/admin/leads/update-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, stage: newStage }),
      });
    } catch (e) {
      console.error("Failed to update pipeline stage in DB", e);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.founder_name && l.founder_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStage = filterStage === "all" || l.pipeline_stage === filterStage;

    return matchesSearch && matchesStage;
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
      {/* Filtering Actions Panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-2xl">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
          <input
            type="text"
            placeholder="Search leads, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none focus:border-[#D8A04C] transition-all"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-[#6B6B6B]" />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="h-10 px-3 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none focus:border-[#D8A04C] cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="client">Client</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* CRM list cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="glass-panel rounded-2xl p-6 border border-[#E8E1D5] hover:border-[#D8A04C]/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#8E5F28] uppercase font-bold tracking-wider">
                  Lead Information
                </span>
                <h3 className="text-base font-bold text-[#0A0A0A] mt-0.5">
                  {lead.company_name}
                </h3>
                {lead.founder_name && (
                  <p className="text-xs text-[#6B6B6B]">Founder: {lead.founder_name}</p>
                )}
              </div>

              {lead.assessments && (
                <div className="text-right">
                  <span className={cn(
                    "inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-bold capitalize",
                    getRiskBadgeColor(lead.assessments.risk_level)
                  )}>
                    {lead.assessments.risk_level}
                  </span>
                  <span className="block text-sm font-extrabold text-[#0A0A0A] mt-1">
                    {lead.assessments.overall_score}% Health
                  </span>
                </div>
              )}
            </div>

            {/* Contacts details */}
            <div className="space-y-2 text-xs text-[#6B6B6B]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9B9B9B] shrink-0" />
                <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#9B9B9B] shrink-0" />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>

            {/* Pipeline State select / actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E1D5]/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#6B6B6B]">Stage:</span>
                <select
                  value={lead.pipeline_stage}
                  onChange={(e) => handleStageChange(lead.id, e.target.value as any)}
                  className="h-8 px-2 text-[10px] bg-white border border-[#E8E1D5] rounded-lg outline-none cursor-pointer focus:border-[#D8A04C]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="client">Client</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {lead.assessments && (
                <Link
                  href={`/results/${lead.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8E5F28] hover:text-[#D8A04C]"
                >
                  <span>Review Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
        {filteredLeads.length === 0 && (
          <div className="col-span-full text-center py-12 glass-panel rounded-2xl text-xs text-[#6B6B6B]">
            No leads found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
