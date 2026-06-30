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
  recommendation: string;
  priority: number; // 1 = highest priority
  estimatedEffort: "low" | "medium" | "high";
}

export interface AssessmentResult {
  overallScore: number; // 0-100
  overallRiskLevel: RiskLevel;
  categoryScores: CategoryScore[];
  risks: RiskItem[];
  totalQuestions: number;
  answeredQuestions: number;
  completionPercentage: number;
}

export type Answers = Record<string, string | string[]>;

function getAnswerScore(question: AssessmentQuestion, answer: string | string[]): number {
  if (question.type === "multi_choice" && Array.isArray(answer)) {
    // For multi-choice, average the selected option scores
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

function generateRecommendation(question: AssessmentQuestion, score: number): string {
  const recommendations: Record<string, Record<string, string>> = {
    "cf-1": {
      low: "Register your company immediately — either as a Private Limited Company (recommended for investor-readiness) or LLP. This is foundational for all other compliance.",
    },
    "cf-5": {
      low: "Apply for DPIIT Startup Recognition through the Startup India portal. Benefits include self-certification, tax exemptions under Section 80-IAC, and access to government tenders.",
    },
    "cf-6": {
      low: "File pending ROC returns immediately to avoid escalating penalties. Consider hiring a Company Secretary for ongoing compliance.",
    },
    "fa-1": {
      low: "Draft and execute a comprehensive Shareholders' Agreement covering ownership, roles, exit, drag/tag-along, and anti-dilution provisions.",
    },
    "fa-2": {
      low: "Implement a 4-year vesting schedule with a 1-year cliff for all founders. This is critical for investor confidence and protects against early departures.",
    },
    "fa-3": {
      low: "Execute IP Assignment Agreements immediately. All code, designs, and inventions created by founders must be assigned to the company entity.",
    },
    "hr-1": {
      low: "Draft and execute employment agreements for all team members. Include confidentiality, IP assignment, and termination clauses.",
    },
    "hr-3": {
      low: "Establish a POSH policy, form an Internal Committee, and conduct awareness training. This is mandatory for companies with 10+ employees.",
    },
    "ip-1": {
      low: "File trademark applications for your brand name, logo, and tagline in relevant classes. DPIIT-registered startups get 50% fee reduction.",
    },
    "cc-1": {
      low: "Publish comprehensive Terms of Service covering usage rights, limitations, liability, governing law, and dispute resolution.",
    },
    "dp-1": {
      low: "Draft and publish a Privacy Policy compliant with the DPDP Act 2023. Detail data collection, processing purposes, retention, and user rights.",
    },
    "dp-2": {
      low: "Conduct a DPDP Act compliance assessment. Map your data flows, identify processing purposes, and implement consent mechanisms.",
    },
    "rc-1": {
      low: "Register for GST immediately if your turnover exceeds the threshold. File pending returns to avoid interest and penalties.",
    },
    "rc-7": {
      low: "Ensure FEMA compliance for all foreign investments — file Form FC-GPR/FC-TRS within 30 days and maintain documentation.",
    },
  };

  if (score >= 70) return "";

  const rec = recommendations[question.id];
  if (rec?.low) return rec.low;

  // Fallback generic recommendations
  return `Review and address the "${question.text.replace("?", "")}" requirement. Consult a legal professional for compliance guidance.`;
}

function getEstimatedEffort(question: AssessmentQuestion): "low" | "medium" | "high" {
  if (question.riskLevel === "critical") return "high";
  if (question.weight >= 3) return "high";
  if (question.weight >= 2) return "medium";
  return "low";
}

export function calculateScores(answers: Answers): AssessmentResult {
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

  // Process each question
  let priorityCounter = 0;
  for (const question of questions) {
    const catData = categoryScoresMap.get(question.categorySlug);
    if (!catData) continue;

    catData.questionCount++;
    catData.totalWeight += question.weight;

    const answer = answers[question.id];
    if (answer !== undefined && answer !== null && answer !== "") {
      catData.answeredCount++;
      const score = getAnswerScore(question, answer);
      catData.weightedScore += score * question.weight;

      // Track risks (questions with low scores)
      if (score < 70) {
        const recommendation = generateRecommendation(question, score);
        if (recommendation) {
          priorityCounter++;
          catData.risks.push({
            questionId: question.id,
            questionText: question.text,
            riskLevel: question.riskLevel,
            category: question.category,
            currentScore: score,
            maxScore: 100,
            recommendation,
            priority: priorityCounter,
            estimatedEffort: getEstimatedEffort(question),
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
      // Sort by risk level first (critical > high > medium > low), then by score (lower first)
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

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== null && answers[k] !== ""
  ).length;

  return {
    overallScore,
    overallRiskLevel: getRiskLevel(overallScore),
    categoryScores,
    risks: allRisks,
    totalQuestions,
    answeredQuestions,
    completionPercentage: Math.round((answeredQuestions / totalQuestions) * 100),
  };
}
