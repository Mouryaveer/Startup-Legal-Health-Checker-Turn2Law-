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
  Save, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const LOCAL_STORAGE_KEY = "t2l_legal_assessment_answers";

export function AssessmentWizard() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeCategory = categories[currentCategoryIndex];
  
  // Filter questions for the active category
  const categoryQuestions = questions.filter(
    (q) => q.categorySlug === activeCategory.slug
  );
  
  const currentQuestion = categoryQuestions[currentQuestionIndex];

  // Load saved answers on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved answers", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save answers to localStorage when updated
  const saveAnswers = (newAnswers: Record<string, string | string[]>) => {
    setAnswers(newAnswers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAnswers));
  };

  const handleSelectOption = (questionId: string, value: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    if (question.type === "multi_choice") {
      const currentAnswer = (answers[questionId] as string[]) || [];
      const updated = currentAnswer.includes(value)
        ? currentAnswer.filter((v) => v !== value)
        : [...currentAnswer, value];
      saveAnswers({ ...answers, [questionId]: updated });
    } else {
      saveAnswers({ ...answers, [questionId]: value });
      // Auto advance for yes_no and single_choice after a short delay
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentCategoryIndex > 0) {
      const prevCategory = categories[currentCategoryIndex - 1];
      const prevQuestions = questions.filter(
        (q) => q.categorySlug === prevCategory.slug
      );
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setCurrentQuestionIndex(prevQuestions.length - 1);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAnswers({});
    setCurrentCategoryIndex(0);
    setCurrentQuestionIndex(0);
    setShowConfirmReset(false);
  };

  const isCategoryComplete = (categorySlug: string) => {
    const catQuestions = questions.filter((q) => q.categorySlug === categorySlug);
    return catQuestions.every((q) => answers[q.id] !== undefined && answers[q.id] !== "");
  };

  const getCategoryProgress = (categorySlug: string) => {
    const catQuestions = questions.filter((q) => q.categorySlug === categorySlug);
    const answered = catQuestions.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] !== ""
    ).length;
    return {
      answered,
      total: catQuestions.length,
      percentage: (answered / catQuestions.length) * 100,
    };
  };

  const isAssessmentComplete = questions.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate final results
      const results = calculateScores(answers);
      
      // Store complete assessment details in DB via API or Server Action
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          scores: results,
          companyName: localStorage.getItem("t2l_company_name") || "My Startup",
          companyEmail: localStorage.getItem("t2l_company_email") || "founder@startup.com",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      const data = await response.json();
      
      // If server returned a local/demo ID fallback, store the results locally before clearing
      if (data.id && data.id.startsWith("local-")) {
        const localKey = `t2l_local_results_${data.id.replace("local-", "")}`;
        localStorage.setItem(
          localKey,
          JSON.stringify({ answers, scores: results })
        );
      }

      // Clear localStorage answers upon successful submission
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      // Redirect to results page
      router.push(`/results/${data.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      // Fallback: Generate local ID for offline demo if DB call fails
      const mockId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(`t2l_local_results_${mockId}`, JSON.stringify({ answers, scores: calculateScores(answers) }));
      router.push(`/results/local-${mockId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAnswered = questions.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  ).length;
  
  const overallProgress = (totalAnswered / questions.length) * 100;

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#D8A04C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-[#6B6B6B] mt-4 font-medium">Loading assessment state...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar navigation */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#8E5F28]">Assessment Categories</h2>
          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const isActive = idx === currentCategoryIndex;
              const isDone = isCategoryComplete(cat.slug);
              const progress = getCategoryProgress(cat.slug);

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
                    {/* Small progress indicator */}
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
        <div className="glass-panel rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
            <span>Overall Progress</span>
            <span className="font-semibold">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-[#E8E1D5]/50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#D8A04C] to-[#E8BD6E] h-full transition-all duration-500" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-[#6B6B6B] border border-[#E8E1D5] rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main wizard workspace */}
      <div className="lg:col-span-3 space-y-6">
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
                      This will permanently erase all answers you have entered so far. This action cannot be undone.
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

            {/* Answer inputs */}
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
                        "text-sm font-medium",
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
      </div>
    </div>
  );
}
