// ============================================================
// Turn2Law Legal Health Check — Scoring Engine
// ============================================================

import {
  type AssessmentQuestion,
  type RiskLevel,
  questions,
  categories,
} from "./questions";

export interface CategoryScore {
  slug: string;
  name: string;
  score: number; // 0-100
  maxScore: number;
  earnedScore: number;
  questionCount: number;
  answeredCount: number;
  riskLevel: RiskLevel;
  risks: RiskItem[];
}

export interface RiskItem {
  questionId: string;
  questionText: string;
  riskLevel: RiskLevel;
  category: string;
  currentScore: number;
  maxScore: number;
  title: string;
  whyItMatters: string;
  businessImpact: string;
  nextStep: string;
  estimatedEffort: "low" | "medium" | "high";
  serviceLink: string;
  priority: number;
}

export interface ComplianceStrength {
  title: string;
  description: string;
}

export interface ComplianceWeakness {
  title: string;
  description: string;
}

export interface AssessmentResult {
  overallScore: number; // 0-100
  overallRiskLevel: RiskLevel;
  complianceMaturity: "Early Stage" | "Seed Ready" | "Series-A Ready";
  categoryScores: CategoryScore[];
  risks: RiskItem[];
  strengths: ComplianceStrength[];
  weaknesses: ComplianceWeakness[];
  missingDocuments: string[];
  totalQuestions: number;
  answeredQuestions: number;
  completionPercentage: number;
}

export type Answers = Record<string, string | string[]>;

function getAnswerScore(question: AssessmentQuestion, answer: string | string[]): number {
  if (question.type === "multi_choice" && Array.isArray(answer)) {
    if (answer.length === 0) return 0;
    const total = answer.reduce((sum, val) => {
      const opt = question.options.find((o) => o.value === val);
      return sum + (opt?.score || 0);
    }, 0);
    return total / answer.length;
  }

  const answerStr = typeof answer === "string" ? answer : answer[0];
  const option = question.options.find((o) => o.value === answerStr);
  return option?.score || 0;
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  if (score >= 40) return "high";
  return "critical";
}

function getComplianceMaturity(score: number): AssessmentResult["complianceMaturity"] {
  if (score >= 80) return "Series-A Ready";
  if (score >= 60) return "Seed Ready";
  return "Early Stage";
}

export function calculateScores(answers: Answers, industry?: string): AssessmentResult {
  // Filter questions by active industry
  const activeQuestions = questions.filter(q => {
    // If question has industry limits, check if user's industry matches
    if (q.industryDependent && q.industryDependent.length > 0) {
      if (!industry) return false;
      return q.industryDependent.includes(industry);
    }
    
    // Check conditional display logic
    if (q.conditionalParentId) {
      const parentAns = answers[q.conditionalParentId];
      if (parentAns !== q.conditionalValue) {
        return false;
      }
    }
    
    return true;
  });

  const categoryScoresMap = new Map<
    string,
    {
      totalWeight: number;
      weightedScore: number;
      questionCount: number;
      answeredCount: number;
      risks: RiskItem[];
    }
  >();

  // Initialize categories
  for (const cat of categories) {
    categoryScoresMap.set(cat.slug, {
      totalWeight: 0,
      weightedScore: 0,
      questionCount: 0,
      answeredCount: 0,
      risks: [],
    });
  }

  const strengths: ComplianceStrength[] = [];
  const weaknesses: ComplianceWeakness[] = [];
  const missingDocuments: string[] = [];

  // Process each question
  let priorityCounter = 0;
  for (const question of activeQuestions) {
    const catData = categoryScoresMap.get(question.categorySlug);
    if (!catData) continue;

    catData.questionCount++;
    catData.totalWeight += question.weight;

    const answer = answers[question.id];
    const isAnswered = answer !== undefined && answer !== null && answer !== "";

    if (isAnswered) {
      catData.answeredCount++;
      const score = getAnswerScore(question, answer);
      catData.weightedScore += score * question.weight;

      const rec = question.recommendation;

      if (score >= 90) {
        strengths.push({
          title: rec?.title || question.text.replace("Is your ", "").replace("Do you have a ", ""),
          description: "This compliance requirement is successfully fulfilled and fully set up.",
        });
      } else {
        // Build missing document list
        if (score === 0 || answer === "no") {
          if (question.id === "cf-1") missingDocuments.push("Certificate of Incorporation");
          if (question.id === "fa-1") missingDocuments.push("Shareholders' Agreement (SHA)");
          if (question.id === "fa-2") missingDocuments.push("Founder Vesting Agreement");
          if (question.id === "fa-3") missingDocuments.push("IP Assignment Agreements");
          if (question.id === "hr-3") missingDocuments.push("POSH Policy Document");
          if (question.id === "dp-1") missingDocuments.push("DPDP Compliant Website Privacy Policy");
        }

        // Add weakness
        weaknesses.push({
          title: rec?.title || question.text,
          description: rec?.whyItMatters || "Missing standard compliance document or regulatory filing.",
        });

        // Track risks (questions with low scores)
        if (score < 70 && rec) {
          priorityCounter++;
          catData.risks.push({
            questionId: question.id,
            questionText: question.text,
            riskLevel: question.riskLevel,
            category: question.category,
            currentScore: score,
            maxScore: 100,
            title: rec.title,
            whyItMatters: rec.whyItMatters,
            businessImpact: rec.businessImpact,
            nextStep: rec.nextStep,
            estimatedEffort: rec.effort,
            serviceLink: rec.serviceLink,
            priority: priorityCounter,
          });
        }
      }
    }
  }

  // Calculate category scores
  const categoryScores: CategoryScore[] = [];
  for (const cat of categories) {
    const data = categoryScoresMap.get(cat.slug)!;
    const score =
      data.totalWeight > 0
        ? Math.round(data.weightedScore / data.totalWeight)
        : 0;

    categoryScores.push({
      slug: cat.slug,
      name: cat.name,
      score,
      maxScore: 100,
      earnedScore: score,
      questionCount: data.questionCount,
      answeredCount: data.answeredCount,
      riskLevel: getRiskLevel(score),
      risks: data.risks,
    });
  }

  // Calculate overall score (weighted by category weights)
  let totalCategoryWeight = 0;
  let weightedOverallScore = 0;
  for (const cat of categories) {
    const catScore = categoryScores.find((cs) => cs.slug === cat.slug);
    if (catScore) {
      totalCategoryWeight += cat.weight;
      weightedOverallScore += catScore.score * cat.weight;
    }
  }
  const overallScore =
    totalCategoryWeight > 0
      ? Math.round(weightedOverallScore / totalCategoryWeight)
      : 0;

  // Collect and sort all risks by priority
  const allRisks = categoryScores
    .flatMap((cs) => cs.risks)
    .sort((a, b) => {
      const levelOrder: Record<RiskLevel, number> = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      const levelDiff = levelOrder[a.riskLevel] - levelOrder[b.riskLevel];
      if (levelDiff !== 0) return levelDiff;
      return a.currentScore - b.currentScore;
    })
    .map((risk, index) => ({ ...risk, priority: index + 1 }));

  const totalQuestions = activeQuestions.length;
  const answeredQuestions = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== null && answers[k] !== "" && activeQuestions.some(aq => aq.id === k)
  ).length;

  return {
    overallScore,
    overallRiskLevel: getRiskLevel(overallScore),
    complianceMaturity: getComplianceMaturity(overallScore),
    categoryScores,
    risks: allRisks,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    missingDocuments,
    totalQuestions,
    answeredQuestions,
    completionPercentage: Math.round((answeredQuestions / totalQuestions) * 100),
  };
}
