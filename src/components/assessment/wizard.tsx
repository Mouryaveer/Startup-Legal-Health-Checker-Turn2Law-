"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  questions, 
  categories, 
  type AssessmentQuestion, 
  type QuestionType 
} from "@/lib/assessment/questions";
import { calculateScores } from "@/lib/assessment/scoring";
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Building2,
  FileCheck2
} from "lucide-react";
import { cn } from "@/lib/utils";

const LOCAL_STORAGE_KEY = "t2l_legal_assessment_answers";
const INDUSTRY_STORAGE_KEY = "t2l_legal_assessment_industry";

const industriesList = [
  { value: "SaaS", label: "Software as a Service (SaaS)" },
  { value: "FinTech", label: "Financial Technology (FinTech)" },
  { value: "E-commerce", label: "E-commerce & Retail" },
  { value: "Healthcare", label: "HealthTech & Healthcare" },
  { value: "General", label: "General Startup / Other" }
];

export function AssessmentWizard() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedIndustry, setSelectedIndustry] = useState<string>("General");
  const [isIndustrySelected, setIsIndustrySelected] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState<"idle" | "saving" | "saved">("idle");
  const [dynamicQuestions, setDynamicQuestions] = useState<AssessmentQuestion[]>(questions);

  // Load state on mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedIndustry = localStorage.getItem(INDUSTRY_STORAGE_KEY);

    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Failed to parse saved answers", e);
      }
    }
    
    if (savedIndustry) {
      setSelectedIndustry(savedIndustry);
      setIsIndustrySelected(true);
    }

    // Fetch dynamic questions from database rules API
    const loadDbQuestions = async () => {
      try {
        const res = await fetch("/api/admin/questions");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mapped = data.map((q: any) => ({
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
            }));
            setDynamicQuestions(mapped);
          }
        }
      } catch (err) {
        console.warn("Failed to load questions from database, using local static questions as fallback:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadDbQuestions();
  }, []);

  const saveAnswers = (newAnswers: Record<string, string | string[]>) => {
    setAnswers(newAnswers);
    setSaveIndicator("saving");
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAnswers));
    setTimeout(() => setSaveIndicator("saved"), 500);
  };

  const handleSelectIndustry = (industry: string) => {
    setSelectedIndustry(industry);
    localStorage.setItem(INDUSTRY_STORAGE_KEY, industry);
    setIsIndustrySelected(true);
  };

  // Filter active questions based on industry selection & skip logic
  const activeQuestions = dynamicQuestions.filter((q) => {
    // Check industry restriction
    if (q.industryDependent && q.industryDependent.length > 0) {
      if (!q.industryDependent.includes(selectedIndustry)) {
        return false;
      }
    }

    // Check conditional parent logic
    if (q.conditionalParentId) {
      const parentAns = answers[q.conditionalParentId];
      if (parentAns !== q.conditionalValue) {
        return false;
      }
    }

    return true;
  });

  const activeCategory = categories[currentCategoryIndex];

  // Questions for the active category
  const categoryQuestions = activeQuestions.filter(
    (q) => q.categorySlug === activeCategory.slug
  );

  const currentQuestion = categoryQuestions[currentQuestionIndex];

  const handleSelectOption = (questionId: string, value: string) => {
    const question = dynamicQuestions.find((q) => q.id === questionId);
    if (!question) return;

    if (question.type === "multi_choice") {
      const currentAnswer = (answers[questionId] as string[]) || [];
      const updated = currentAnswer.includes(value)
        ? currentAnswer.filter((v) => v !== value)
        : [...currentAnswer, value];
      saveAnswers({ ...answers, [questionId]: updated });
    } else {
      saveAnswers({ ...answers, [questionId]: value });
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Find next category that has questions
      let nextIndex = currentCategoryIndex + 1;
      while (nextIndex < categories.length) {
        const nextCat = categories[nextIndex];
        const nextQuestions = activeQuestions.filter((q) => q.categorySlug === nextCat.slug);
        if (nextQuestions.length > 0) {
          setCurrentCategoryIndex(nextIndex);
          setCurrentQuestionIndex(0);
          return;
        }
        nextIndex++;
      }
      // If no subsequent categories have active questions, we are at the end
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentCategoryIndex > 0) {
      // Find previous category that has questions
      let prevIndex = currentCategoryIndex - 1;
      while (prevIndex >= 0) {
        const prevCat = categories[prevIndex];
        const prevQuestions = activeQuestions.filter((q) => q.categorySlug === prevCat.slug);
        if (prevQuestions.length > 0) {
          setCurrentCategoryIndex(prevIndex);
          setCurrentQuestionIndex(prevQuestions.length - 1);
          return;
        }
        prevIndex--;
      }
    }
  };

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(INDUSTRY_STORAGE_KEY);
    setAnswers({});
    setSelectedIndustry("General");
    setIsIndustrySelected(false);
    setCurrentCategoryIndex(0);
    setCurrentQuestionIndex(0);
    setShowConfirmReset(false);
  };

  const isCategoryComplete = (categorySlug: string) => {
    const catQuestions = activeQuestions.filter((q) => q.categorySlug === categorySlug);
    if (catQuestions.length === 0) return true; // skip categories with no active questions
    return catQuestions.every((q) => answers[q.id] !== undefined && answers[q.id] !== "");
  };

  const getCategoryProgress = (categorySlug: string) => {
    const catQuestions = activeQuestions.filter((q) => q.categorySlug === categorySlug);
    if (catQuestions.length === 0) return { answered: 0, total: 0, percentage: 100 };
    const answered = catQuestions.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] !== ""
    ).length;
    return {
      answered,
      total: catQuestions.length,
      percentage: (answered / catQuestions.length) * 100,
    };
  };

  const isAssessmentComplete = activeQuestions.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const results = calculateScores(answers, selectedIndustry);
      const companyName = localStorage.getItem("t2l_company_name") || "My Startup";
      const companyEmail = localStorage.getItem("t2l_company_email") || "founder@startup.com";

      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          scores: results,
          companyName,
          companyEmail,
          industry: selectedIndustry,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      const data = await response.json();

      // Offline storage backup trigger if local- fallback is used
      if (data.id && data.id.startsWith("local-")) {
        const localKey = `t2l_local_results_${data.id.replace("local-", "")}`;
        localStorage.setItem(localKey, JSON.stringify({ answers, scores: results }));
      }

      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(INDUSTRY_STORAGE_KEY);

      router.push(`/results/${data.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      const mockId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(
        `t2l_local_results_${mockId}`,
        JSON.stringify({ answers, scores: calculateScores(answers, selectedIndustry) })
      );
      router.push(`/results/local-${mockId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculations for progress & remaining time
  const totalQuestionsCount = activeQuestions.length;
  const totalAnsweredCount = activeQuestions.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  ).length;

  const overallProgress = totalQuestionsCount > 0 ? (totalAnsweredCount / totalQuestionsCount) * 100 : 0;
  
  // Estimate time: roughly 12 seconds per question remaining
  const remainingQuestions = totalQuestionsCount - totalAnsweredCount;
  const estimatedTimeRemaining = Math.max(1, Math.ceil((remainingQuestions * 12) / 60));

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#D8A04C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#6B6B6B] mt-4 font-medium">Loading assessment wizard...</p>
      </div>
    );
  }

  // Render Industry selection card first
  if (!isIndustrySelected) {
    return (
      <div className="max-w-xl mx-auto glass-panel-strong rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FDF8EF] border border-[#E8D5B0] text-[#D8A04C] mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#0A0A0A]">Select Industry Focus</h2>
          <p className="text-xs text-[#6B6B6B]">We adapt our compliance checks based on your specific operational domain.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2">
          {industriesList.map((ind) => (
            <button
              key={ind.value}
              onClick={() => handleSelectIndustry(ind.value)}
              className="w-full text-left p-4 rounded-xl border border-[#E8E1D5] hover:border-[#D8A04C]/40 hover:bg-[#FDF8EF]/30 flex items-center justify-between group transition-all duration-200 cursor-pointer focus-ring-gold"
            >
              <span className="text-sm font-semibold text-[#3D3D3D] group-hover:text-[#0A0A0A]">{ind.label}</span>
              <ChevronRight className="w-4 h-4 text-[#9B9B9B] group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active question layout
  return (
    <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar navigation */}
      <div className="hidden lg:block lg:col-span-1 space-y-4">
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#8E5F28]">Assessment Categories</h2>
          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const isActive = idx === currentCategoryIndex;
              const isDone = isCategoryComplete(cat.slug);
              const progress = getCategoryProgress(cat.slug);

              // Hide categories if no active questions exist for the category
              const catQuestions = activeQuestions.filter((q) => q.categorySlug === cat.slug);
              if (catQuestions.length === 0) return null;

              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setCurrentCategoryIndex(idx);
                    setCurrentQuestionIndex(0);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-all duration-300 relative group flex items-start gap-3",
                    isActive 
                      ? "bg-[#FDF8EF] border border-[#D8A04C]/30 text-[#0A0A0A] font-semibold"
                      : "hover:bg-[#F5F1EB]/40 border border-transparent text-[#6B6B6B]"
                  )}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    ) : (
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold",
                        isActive ? "border-[#D8A04C]" : "border-[#BFBFBF]"
                      )}>
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs truncate block">{cat.name}</span>
                    <div className="w-full bg-[#E8E1D5]/50 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="bg-[#D8A04C] h-full transition-all duration-500" 
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-panel rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
            <span>Completion Status</span>
            <span className="font-semibold">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-[#E8E1D5]/50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#D8A04C] to-[#E8BD6E] h-full transition-all duration-500" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] bg-[#F5F1EB]/50 p-2.5 rounded-xl border border-[#E8E1D5]/30">
            <Clock className="w-4 h-4 text-[#D8A04C] shrink-0" />
            <span>Est. remaining: <strong>~{estimatedTimeRemaining} mins</strong></span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E8E1D5]/40 text-[10px]">
            <span className="text-[#6B6B6B] flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5 text-[#16A34A]" />
              Auto-save:
            </span>
            <span className={cn(
              "font-semibold uppercase tracking-wider",
              saveIndicator === "saving" ? "text-amber-600" : "text-green-600"
            )}>
              {saveIndicator === "saving" ? "Saving..." : "Synced"}
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2 px-3 text-[10px] font-bold text-[#6B6B6B] border border-[#E8E1D5] rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Main wizard workspace */}
      <div className="lg:col-span-3 space-y-4 sm:space-y-6">
        {/* Mobile progress tracker */}
        <div className="block lg:hidden glass-panel rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
            <span className="font-bold text-[#0A0A0A]">{activeCategory.name}</span>
            <span>{Math.round(overallProgress)}% Done</span>
          </div>
          <div className="w-full bg-[#E8E1D5]/50 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#D8A04C] h-full transition-all duration-500" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#6B6B6B]">
            <span>Question {currentQuestionIndex + 1} of {categoryQuestions.length}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#D8A04C]" />
              ~{estimatedTimeRemaining}m remaining
            </span>
          </div>
        </div>

        {/* Reset Confirmation Overlay */}
        <AnimatePresence>
          {showConfirmReset && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0A0A0A]/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#E8E1D5] shadow-xl space-y-4"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A0A0A]">Reset Assessment?</h3>
                    <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                      This will permanently erase all answers and reset your selected industry focus. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2 px-4 border border-[#E8E1D5] text-xs font-semibold text-[#3D3D3D] rounded-xl hover:bg-[#F5F1EB] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 px-4 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Question Box */}
        {currentQuestion ? (
          <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header info */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8E5F28] uppercase tracking-widest bg-[#FDF8EF] px-3 py-1 rounded-full border border-[#E8D5B0]">
                  {activeCategory.name}
                </span>
                <span className="text-xs font-medium text-[#6B6B6B]">
                  Question {currentQuestionIndex + 1} of {categoryQuestions.length}
                </span>
              </div>

              {/* Question title & Help text */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] leading-snug">
                  {currentQuestion.text}
                </h2>
                {currentQuestion.helpText && (
                  <div className="flex gap-2 p-3.5 rounded-xl bg-[#F5F1EB]/50 border border-[#E8E1D5]/40 text-xs text-[#6B6B6B] leading-relaxed">
                    <HelpCircle className="w-4 h-4 text-[#D8A04C] shrink-0 mt-0.5" />
                    <span>{currentQuestion.helpText}</span>
                  </div>
                )}
              </div>

              {/* Answer options */}
              <div className="pt-4">
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = Array.isArray(answers[currentQuestion.id])
                      ? (answers[currentQuestion.id] as string[]).includes(option.value)
                      : answers[currentQuestion.id] === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSelectOption(currentQuestion.id, option.value)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group cursor-pointer focus-ring-gold",
                          isSelected
                            ? "border-[#D8A04C] bg-[#FDF8EF]/50 shadow-[0_4px_12px_rgba(216,160,76,0.08)]"
                            : "border-[#E8E1D5] hover:border-[#D8A04C]/40 bg-white"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-semibold",
                          isSelected ? "text-[#8E5F28]" : "text-[#3D3D3D] group-hover:text-[#0A0A0A]"
                        )}>
                          {option.label}
                        </span>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0",
                          isSelected 
                            ? "border-[#D8A04C] bg-[#D8A04C] text-white" 
                            : "border-[#E8E1D5] bg-white group-hover:border-[#D8A04C]/50"
                        )}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between border-t border-[#E8E1D5] pt-6 mt-8">
              <button
                onClick={handleBack}
                disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
                className="py-2.5 px-5 border border-[#E8E1D5] text-sm font-semibold rounded-xl text-[#3D3D3D] hover:bg-[#F5F1EB] hover:text-[#0A0A0A] disabled:opacity-40 disabled:hover:bg-transparent transition-all flex items-center gap-1.5 focus-ring-gold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {currentCategoryIndex === categories.length - 1 &&
              currentQuestionIndex === categoryQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isAssessmentComplete}
                  className={cn(
                    "py-2.5 px-6 font-semibold text-sm rounded-xl text-white gold-gradient-bg shadow-md transition-all flex items-center gap-1.5 focus-ring-gold",
                    "disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  )}
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Submit & View Results</span>
                  )}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="py-2.5 px-6 border border-[#0A0A0A] bg-[#0A0A0A] hover:bg-[#D8A04C] hover:border-[#D8A04C] text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-1.5 focus-ring-gold"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-panel-strong rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0A0A0A]">Ready for Submission</h3>
            <p className="text-sm text-[#6B6B6B] max-w-sm leading-relaxed">
              You have completed all active compliance questions for your startup category. Click below to submit.
            </p>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="py-3 px-8 text-sm font-semibold text-white gold-gradient-bg rounded-xl shadow-md"
            >
              {isSubmitting ? "Generating Report..." : "Submit Audit Check"}
            </button>
          </div>
        )}

        {/* Mobile Reset & Info Panel */}
        <div className="block lg:hidden text-center space-y-3 pt-2">
          <div className="flex justify-between items-center text-[10px] text-[#6B6B6B] px-2 bg-[#F5F1EB]/30 p-2.5 rounded-xl border border-[#E8E1D5]/20">
            <span className="flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5 text-[#16A34A]" />
              Auto-save: <strong className="text-green-600 font-semibold uppercase">Synced</strong>
            </span>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
