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
  FileSpreadsheet,
  Plus,
  Trash2,
  CalendarDays,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadNote {
  text: string;
  author: string;
  date: string;
}

interface Lead {
  id: string;
  company_name: string;
  email: string;
  phone?: string;
  founder_name?: string;
  pipeline_stage: "new" | "contacted" | "qualified" | "proposal" | "client" | "lost";
  created_at: string;
  assigned_to?: string;
  notes?: LeadNote[];
  tags?: string[];
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
    assigned_to: "Dev Singhania",
    tags: ["High Value", "Incorporation"],
    notes: [
      { text: "Called founder, scheduled review meeting for next Tuesday.", author: "Dev S.", date: new Date().toLocaleDateString() }
    ],
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
    assigned_to: "Aarti Roy",
    tags: ["Series-A", "HealthTech"],
    notes: [],
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
    assigned_to: "Dev Singhania",
    tags: ["FinTech", "RBI Audit"],
    notes: [
      { text: "Fintech audit completed. Client requested corporate structures cleanup.", author: "Dev S.", date: new Date(Date.now() - 86400000).toLocaleDateString() }
    ],
    assessments: { overall_score: 59, risk_level: "medium" }
  }
];

export function LeadsDashboardClient({ initialLeads }: LeadsDashboardClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads && initialLeads.length ? initialLeads : mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [newTagText, setNewTagText] = useState("");

  const handleStageChange = async (leadId: string, newStage: Lead["pipeline_stage"]) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipeline_stage: newStage } : l));
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, pipeline_stage: newStage } : null);
    }

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

  const handleAssignMember = async (leadId: string, member: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assigned_to: member } : l));
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, assigned_to: member } : null);
    }

    try {
      await fetch("/api/admin/leads/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, assignedTo: member }),
      });
    } catch (e) {
      console.error("Failed to update assigned member in DB", e);
    }
  };

  const handleAddNote = async (leadId: string) => {
    if (!newNoteText.trim()) return;

    const newNote: LeadNote = {
      text: newNoteText.trim(),
      author: "Admin User",
      date: new Date().toLocaleDateString()
    };

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, notes: [...(l.notes || []), newNote] };
      }
      return l;
    }));

    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, notes: [...(prev.notes || []), newNote] } : null);
    }

    setNewNoteText("");

    try {
      await fetch("/api/admin/leads/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, note: newNote }),
      });
    } catch (e) {
      console.error("Failed to append note in DB", e);
    }
  };

  const handleAddTag = async (leadId: string) => {
    if (!newTagText.trim()) return;

    const tag = newTagText.trim();

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const currentTags = l.tags || [];
        if (currentTags.includes(tag)) return l;
        return { ...l, tags: [...currentTags, tag] };
      }
      return l;
    }));

    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => {
        if (!prev) return null;
        const currentTags = prev.tags || [];
        if (currentTags.includes(tag)) return prev;
        return { ...prev, tags: [...currentTags, tag] };
      });
    }

    setNewTagText("");

    try {
      await fetch("/api/admin/leads/add-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, tag }),
      });
    } catch (e) {
      console.error("Failed to append tag in DB", e);
    }
  };

  const exportToCsv = () => {
    const headers = "Company Name,Founder,Email,Phone,Score,Risk Level,Stage,Assigned To\n";
    const rows = filteredLeads.map(l => 
      `"${l.company_name}","${l.founder_name || ""}","${l.email}","${l.phone || ""}","${l.assessments?.overall_score || 0}","${l.assessments?.risk_level || ""}","${l.pipeline_stage}","${l.assigned_to || ""}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Turn2Law_CRM_Leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
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

        {/* Action Panel */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={exportToCsv}
            className="inline-flex items-center gap-1.5 h-10 px-4 text-xs font-bold text-[#6B6B6B] hover:text-[#0A0A0A] bg-white border border-[#E8E1D5] rounded-xl cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
          
          <div className="flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CRM list cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={cn(
                "glass-panel rounded-2xl p-5 border cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4",
                selectedLead?.id === lead.id ? "border-[#D8A04C] bg-[#FDF8EF]/30" : "border-[#E8E1D5] hover:border-[#D8A04C]/30"
              )}
            >
              {/* Header info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0A0A0A]">
                    {lead.company_name}
                  </h3>
                  {lead.founder_name && (
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5">Founder: {lead.founder_name}</p>
                  )}
                </div>

                {lead.assessments && (
                  <div className="text-right flex items-center gap-3">
                    <span className={cn(
                      "inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-bold capitalize",
                      getRiskBadgeColor(lead.assessments.risk_level)
                    )}>
                      {lead.assessments.risk_level}
                    </span>
                    <span className="text-xs font-extrabold text-[#0A0A0A]">
                      {lead.assessments.overall_score}%
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-bold bg-[#F5F1EB] border border-[#E8E1D5] px-2 py-0.5 rounded text-[#6B6B6B]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Pipeline details footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E8E1D5]/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#6B6B6B]">Stage:</span>
                  <span className="font-bold uppercase text-[#0A0A0A]">{lead.pipeline_stage}</span>
                </div>
                {lead.assigned_to && (
                  <div className="flex items-center gap-1 text-[#6B6B6B]">
                    <UserCheck className="w-3.5 h-3.5 text-[#D8A04C]" />
                    <span>{lead.assigned_to}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredLeads.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl text-xs text-[#6B6B6B]">
              No leads found matching your criteria.
            </div>
          )}
        </div>

        {/* Lead Details Inspector Drawer Panel */}
        <div className="lg:col-span-1 glass-panel-strong rounded-3xl p-6 flex flex-col justify-between min-h-[450px]">
          {selectedLead ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] text-[#8E5F28] uppercase font-bold tracking-wider block">CRM Lead Profile</span>
                  <h3 className="text-base font-bold text-[#0A0A0A] mt-0.5">{selectedLead.company_name}</h3>
                  {selectedLead.founder_name && (
                    <p className="text-xs text-[#6B6B6B]">Founder: {selectedLead.founder_name}</p>
                  )}
                </div>

                {/* Pipeline Stage Select */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#3D3D3D] block">Update Pipeline Stage:</span>
                  <select
                    value={selectedLead.pipeline_stage}
                    onChange={(e) => handleStageChange(selectedLead.id, e.target.value as any)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none cursor-pointer focus:border-[#D8A04C]"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="client">Active Client</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                {/* Assign Team Member */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#3D3D3D] block">Assign Team Member:</span>
                  <select
                    value={selectedLead.assigned_to || ""}
                    onChange={(e) => handleAssignMember(selectedLead.id, e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none cursor-pointer focus:border-[#D8A04C]"
                  >
                    <option value="">Unassigned</option>
                    <option value="Dev Singhania">Dev Singhania</option>
                    <option value="Aarti Roy">Aarti Roy</option>
                    <option value="Karan Mehta">Karan Mehta</option>
                  </select>
                </div>

                {/* Tags Management */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-[#3D3D3D] block">Tags:</span>
                  <div className="flex gap-1.5 relative">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTagText}
                      onChange={(e) => setNewTagText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag(selectedLead.id)}
                      className="w-full h-8 pl-3 pr-8 text-[11px] bg-white border border-[#E8E1D5] rounded-lg outline-none"
                    />
                    <button
                      onClick={() => handleAddTag(selectedLead.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer text-[#6B6B6B]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notes History */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold text-[#3D3D3D] block">Timeline Logs / Notes:</span>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {selectedLead.notes && selectedLead.notes.map((note, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#F5F1EB]/50 border border-[#E8E1D5]/40 text-[10px] space-y-1">
                        <p className="text-[#3D3D3D] leading-relaxed">{note.text}</p>
                        <div className="flex justify-between text-[#9B9B9B] font-medium">
                          <span>By: {note.author}</span>
                          <span>{note.date}</span>
                        </div>
                      </div>
                    ))}
                    {(!selectedLead.notes || selectedLead.notes.length === 0) && (
                      <p className="text-[10px] text-[#9B9B9B]">No timeline notes added yet.</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Write a log note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddNote(selectedLead.id)}
                      className="w-full h-8 pl-3 pr-8 text-[10px] bg-white border border-[#E8E1D5] rounded-lg outline-none"
                    />
                    <button
                      onClick={() => handleAddNote(selectedLead.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E5F28] hover:text-[#D8A04C] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Assessment link */}
              <div className="pt-4 border-t border-[#E8E1D5] flex justify-between items-center">
                <Link
                  href={`/results/${selectedLead.id}`}
                  className="w-full py-2.5 bg-[#0A0A0A] text-white hover:bg-[#D8A04C] text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1"
                >
                  <span>Review Complete Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF8EF] border border-[#E8D5B0] flex items-center justify-center text-[#D8A04C]">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A0A0A]">Inspect Lead</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-[200px]">
                Select a lead card from the grid listing to manage pipelines, team assignments, and notes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
