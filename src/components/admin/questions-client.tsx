"use client";

import { useState } from "react";
import type { AssessmentQuestion, RiskLevel, QuestionType, QuestionOption } from "@/lib/assessment/questions";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Filter,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionsListClientProps {
  initialQuestions: AssessmentQuestion[];
}

export function QuestionsListClient({ initialQuestions }: QuestionsListClientProps) {
  const [questionsList, setQuestionsList] = useState<AssessmentQuestion[]>(initialQuestions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEdit = (q: AssessmentQuestion) => {
    setEditingQuestion({ ...q });
    setIsCreating(false);
    setError("");
    setSuccess("");
  };

  const handleCreateNew = () => {
    setEditingQuestion({
      id: `custom-q-${Math.random().toString(36).substring(2, 8)}`,
      category: "company-formation",
      categorySlug: "company-formation",
      text: "",
      helpText: "",
      type: "yes_no",
      options: [
        { value: "yes", score: 100, label: "Yes" },
        { value: "no", score: 0, label: "No" }
      ],
      weight: 1,
      riskLevel: "medium",
      industryDependent: [],
      conditionalParentId: "",
      conditionalValue: "",
      recommendation: {
        title: "",
        whyItMatters: "",
        businessImpact: "",
        nextStep: "",
        effort: "medium",
        serviceLink: ""
      }
    });
    setIsCreating(true);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    if (!editingQuestion) return;
    setError("");
    setSuccess("");

    if (!editingQuestion.text.trim()) {
      setError("Question text is required");
      return;
    }

    try {
      const response = await fetch("/api/admin/questions", {
        method: isCreating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingQuestion.id,
          category_slug: editingQuestion.categorySlug,
          text: editingQuestion.text,
          help_text: editingQuestion.helpText,
          type: editingQuestion.type,
          options: editingQuestion.options,
          weight: Number(editingQuestion.weight),
          risk_level: editingQuestion.riskLevel,
          industry_dependent: editingQuestion.industryDependent || [],
          conditional_parent_id: editingQuestion.conditionalParentId || null,
          conditional_value: editingQuestion.conditionalValue || null,
          recommendation: editingQuestion.recommendation || {},
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save rules database record");
      }

      // Update local state
      if (isCreating) {
        setQuestionsList(prev => [...prev, editingQuestion]);
        setSuccess("Question successfully created in rules database!");
      } else {
        setQuestionsList(prev => prev.map(q => q.id === editingQuestion.id ? editingQuestion : q));
        setSuccess("Question successfully updated in rules database!");
      }

      setTimeout(() => {
        setEditingQuestion(null);
        setIsCreating(false);
        setSuccess("");
      }, 1500);

    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to update rules database.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    setError("");

    try {
      const response = await fetch(`/api/admin/questions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      setQuestionsList(prev => prev.filter(q => q.id !== id));
      setSuccess("Question deleted successfully!");
      setTimeout(() => setSuccess(""), 1500);
    } catch (e: any) {
      console.error(e);
      setError("Failed to delete question rules.");
    }
  };

  const filteredQuestions = questionsList.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || q.categorySlug === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Rules list */}
      <div className="lg:col-span-2 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-2xl">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
            <input
              type="text"
              placeholder="Search question contents, IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none focus:border-[#D8A04C]"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 h-10 px-4 text-xs font-bold text-white gold-gradient-bg rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Question</span>
            </button>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-10 px-3 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="company-formation">Company Formation</option>
              <option value="founder-agreements">Founder Agreements</option>
              <option value="employment-hr">Employment & HR</option>
              <option value="intellectual-property">Intellectual Property</option>
              <option value="contracts">Contracts</option>
              <option value="data-privacy">Data Privacy</option>
              <option value="regulatory">Regulatory</option>
            </select>
          </div>
        </div>

        {/* List Grid */}
        <div className="space-y-3">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="glass-panel rounded-2xl p-5 border border-[#E8E1D5] flex items-center justify-between gap-6 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] text-[#8E5F28] uppercase font-bold tracking-wider">
                  ID: {q.id} · Weight: {q.weight} · Severity: {q.riskLevel}
                </span>
                <h3 className="text-sm font-bold text-[#0A0A0A] leading-snug truncate">
                  {q.text}
                </h3>
                {q.industryDependent && q.industryDependent.length > 0 && (
                  <span className="inline-block text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                    Sectors: {q.industryDependent.join(", ")}
                  </span>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(q)}
                  className="p-2 rounded-lg border border-[#E8E1D5] hover:border-[#D8A04C]/30 hover:bg-[#FDF8EF] text-[#6B6B6B] hover:text-[#0A0A0A] cursor-pointer"
                  title="Edit question rule"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Delete question rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Drawer Inspector */}
      <div className="lg:col-span-1 glass-panel-strong rounded-3xl p-6 min-h-[450px]">
        {editingQuestion ? (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] text-[#8E5F28] uppercase font-bold tracking-wider block">
                {isCreating ? "Create Question Rule" : "Edit Question Rule"}
              </span>
              <h3 className="text-base font-bold text-[#0A0A0A] mt-0.5">Rules Builder</h3>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-700 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#3D3D3D] uppercase tracking-wider block">Question ID</label>
                <input
                  type="text"
                  disabled={!isCreating}
                  value={editingQuestion.id}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, id: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-[#E8E1D5] rounded-xl outline-none focus:border-[#D8A04C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#3D3D3D] uppercase tracking-wider block">Category Segment</label>
                <select
                  value={editingQuestion.categorySlug}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, categorySlug: e.target.value, category: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none cursor-pointer"
                >
                  <option value="company-formation">Company Formation</option>
                  <option value="founder-agreements">Founder Agreements</option>
                  <option value="employment-hr">Employment & HR</option>
                  <option value="intellectual-property">Intellectual Property</option>
                  <option value="contracts">Contracts</option>
                  <option value="data-privacy">Data Privacy</option>
                  <option value="regulatory">Regulatory</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#3D3D3D] uppercase tracking-wider block">Question Text</label>
                <textarea
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  rows={3}
                  className="w-full p-3 text-xs border border-[#E8E1D5] rounded-xl outline-none focus:border-[#D8A04C] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#3D3D3D] uppercase tracking-wider block">Help Text / Explanation</label>
                <input
                  type="text"
                  value={editingQuestion.helpText || ""}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, helpText: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-[#E8E1D5] rounded-xl outline-none focus:border-[#D8A04C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#3D3D3D] uppercase tracking-wider block">Risk Weight (1-3)</label>
                  <select
                    value={editingQuestion.weight}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, weight: Number(e.target.value) })}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none cursor-pointer"
                  >
                    <option value={1}>1 (Low)</option>
                    <option value={2}>2 (Medium)</option>
                    <option value={3}>3 (Critical)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#3D3D3D] uppercase tracking-wider block">Severity Band</label>
                  <select
                    value={editingQuestion.riskLevel}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, riskLevel: e.target.value as RiskLevel })}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#E8E1D5] rounded-xl outline-none cursor-pointer"
                  >
                    <option value="low">Low Severity</option>
                    <option value="medium">Medium Severity</option>
                    <option value="high">High Severity</option>
                    <option value="critical">Critical Severity</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E8E1D5]/60">
                <span className="text-[10px] font-bold text-[#3D3D3D] uppercase tracking-wider block">Remediation Recommendation Settings:</span>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Action Title"
                    value={editingQuestion.recommendation?.title || ""}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      recommendation: { ...(editingQuestion.recommendation || { whyItMatters: "", businessImpact: "", nextStep: "", effort: "medium", serviceLink: "" }), title: e.target.value }
                    })}
                    className="w-full h-8 px-3 text-xs border border-[#E8E1D5] rounded-lg outline-none"
                  />
                  <textarea
                    placeholder="Why it matters explanation..."
                    value={editingQuestion.recommendation?.whyItMatters || ""}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      recommendation: { ...(editingQuestion.recommendation || { title: "", businessImpact: "", nextStep: "", effort: "medium", serviceLink: "" }), whyItMatters: e.target.value }
                    })}
                    rows={2}
                    className="w-full p-2.5 text-xs border border-[#E8E1D5] rounded-lg outline-none resize-none"
                  />
                  <textarea
                    placeholder="Business impact detail..."
                    value={editingQuestion.recommendation?.businessImpact || ""}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      recommendation: { ...(editingQuestion.recommendation || { title: "", whyItMatters: "", nextStep: "", effort: "medium", serviceLink: "" }), businessImpact: e.target.value }
                    })}
                    rows={2}
                    className="w-full p-2.5 text-xs border border-[#E8E1D5] rounded-lg outline-none resize-none"
                  />
                  <input
                    type="text"
                    placeholder="Suggested Next Step action..."
                    value={editingQuestion.recommendation?.nextStep || ""}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      recommendation: { ...(editingQuestion.recommendation || { title: "", whyItMatters: "", businessImpact: "", effort: "medium", serviceLink: "" }), nextStep: e.target.value }
                    })}
                    className="w-full h-8 px-3 text-xs border border-[#E8E1D5] rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-[#E8E1D5]">
              <button
                onClick={() => setEditingQuestion(null)}
                className="flex-1 h-10 border border-[#E8E1D5] text-xs font-bold text-[#6B6B6B] rounded-xl hover:bg-[#F5F1EB] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-10 text-xs font-bold text-white gold-gradient-bg rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Rule</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 h-full min-h-[350px]">
            <div className="w-10 h-10 rounded-full bg-[#FDF8EF] border border-[#E8D5B0] flex items-center justify-center text-[#D8A04C]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0A0A0A]">Rules Inspector</h4>
            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-[200px]">
              Select a question card from the list to edit settings or click &quot;Create Question&quot; to add a new one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
