// ============================================================
// Turn2Law Legal Health Check — Assessment Question Bank
// ============================================================

export type QuestionType =
  | "yes_no"
  | "single_choice"
  | "multi_choice"
  | "scale";

export type RiskLevel = "critical" | "high" | "medium" | "low";

export interface QuestionOption {
  value: string;
  label: string;
  score: number; // 0-100 contribution
}

export interface RecommendationTemplate {
  title: string;
  whyItMatters: string;
  businessImpact: string;
  nextStep: string;
  effort: "low" | "medium" | "high";
  serviceLink: string;
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  categorySlug: string;
  text: string;
  helpText?: string;
  type: QuestionType;
  options: QuestionOption[];
  weight: number; // 1-3, higher = more important
  riskLevel: RiskLevel;
  industryDependent?: string[]; // SaaS, FinTech, E-commerce, Healthcare, EdTech. Empty = generic/all
  conditionalParentId?: string; // Shows only if parent answer matches conditionalValue
  conditionalValue?: string;
  recommendation?: RecommendationTemplate;
}

export interface AssessmentCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  weight: number; // Relative weight in overall score
}

export const categories: AssessmentCategory[] = [
  {
    slug: "company-formation",
    name: "Company Formation & Registration",
    description: "Incorporation status, DPIIT registration, and statutory registrations.",
    icon: "Building2",
    weight: 1.2,
  },
  {
    slug: "founder-agreements",
    name: "Founder Agreements",
    description: "Shareholder agreements, vesting schedules, IP assignments, and co-founder documentation.",
    icon: "Users",
    weight: 1.3,
  },
  {
    slug: "employment-hr",
    name: "Employment & HR",
    description: "Employment contracts, PF/ESI compliance, POSH policy, and workplace regulations.",
    icon: "UserCheck",
    weight: 1.1,
  },
  {
    slug: "intellectual-property",
    name: "Intellectual Property",
    description: "Trademark registration, patent filings, copyright protection, and trade secrets.",
    icon: "Lightbulb",
    weight: 1.0,
  },
  {
    slug: "contracts",
    name: "Contracts & Commercial",
    description: "Customer terms, vendor agreements, NDAs, and commercial contract frameworks.",
    icon: "FileSignature",
    weight: 1.0,
  },
  {
    slug: "data-privacy",
    name: "Data Privacy & IT Law",
    description: "Privacy policy, DPDP Act compliance, IT Act provisions, and data handling practices.",
    icon: "Lock",
    weight: 1.2,
  },
  {
    slug: "regulatory",
    name: "Regulatory & Compliance",
    description: "GST registration, RBI compliance, sector-specific regulations, and annual filings.",
    icon: "Scale",
    weight: 1.0,
  },
];

// Helper to generate yes/no options
function yesNo(yesScore: number): QuestionOption[] {
  return [
    { value: "yes", label: "Yes", score: yesScore },
    { value: "no", label: "No", score: yesScore === 100 ? 0 : 100 },
  ];
}

export const questions: AssessmentQuestion[] = [
  // ── Company Formation & Registration ──
  {
    id: "cf-1",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "Is your company incorporated (Private Limited, LLP, or OPC)?",
    helpText: "Incorporation gives your startup a separate legal identity and limits personal liability.",
    type: "yes_no",
    options: yesNo(100),
    weight: 3,
    riskLevel: "critical",
    recommendation: {
      title: "Register your company entity",
      whyItMatters: "Unincorporated startups expose founders to unlimited personal liability and cannot raise institutional capital.",
      businessImpact: "Investors require a clean corporate structure (preferably Private Limited) before deploying funds.",
      nextStep: "Incorporate as a Private Limited Company. Draft custom MoA/AoA representing your business objectives.",
      effort: "high",
      serviceLink: "https://turn2law.com/services/incorporation",
    },
  },
  {
    id: "cf-2",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "What type of entity is your company registered as?",
    conditionalParentId: "cf-1",
    conditionalValue: "yes",
    type: "single_choice",
    options: [
      { value: "pvt-ltd", label: "Private Limited Company", score: 100 },
      { value: "llp", label: "Limited Liability Partnership (LLP)", score: 85 },
      { value: "opc", label: "One Person Company (OPC)", score: 70 },
      { value: "partnership", label: "Partnership Firm", score: 40 },
      { value: "proprietorship", label: "Sole Proprietorship", score: 20 },
    ],
    weight: 2,
    riskLevel: "high",
    recommendation: {
      title: "Convert entity type to Private Limited",
      whyItMatters: "Partnerships or sole proprietorships do not allow equity allocation, stock option pools (ESOPs), or venture capital investment.",
      businessImpact: "Venture capitalists will not invest in LLPs or partnerships due to structural limitations.",
      nextStep: "Initiate conversion of your partnership/LLP into a Private Limited company.",
      effort: "high",
      serviceLink: "https://turn2law.com/services/company-conversion",
    },
  },
  {
    id: "cf-5",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "Have you registered for DPIIT Startup Recognition?",
    helpText: "DPIIT recognition unlocks tax benefits, self-certification, and government tenders.",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "medium",
    recommendation: {
      title: "Apply for DPIIT Recognition",
      whyItMatters: "DPIIT recognition offers substantial tax exemptions (like Section 80-IAC) and simplified compliance filing procedures.",
      businessImpact: "Reduces corporate tax liabilities for a consecutive block of three years.",
      nextStep: "Prepare pitch deck and write-up to submit for DPIIT recognition on the Startup India portal.",
      effort: "medium",
      serviceLink: "https://turn2law.com/services/dpiit-registration",
    },
  },

  // ── Founder Agreements ──
  {
    id: "fa-1",
    category: "Founder Agreements",
    categorySlug: "founder-agreements",
    text: "Do you have a signed Shareholders' Agreement (SHA) between all co-founders?",
    helpText: "An SHA defines ownership, decision rights, exit clauses, and conflict resolution.",
    type: "yes_no",
    options: yesNo(100),
    weight: 3,
    riskLevel: "critical",
    recommendation: {
      title: "Draft Shareholders' Agreement",
      whyItMatters: "Co-founder disputes without an SHA often result in deadlock and business failure.",
      businessImpact: "Clean governance structures mitigate risks of litigation and make the cap table investor-friendly.",
      nextStep: "Retain legal counsel to draft an SHA specifying decision thresholds, transfer restrictions, and exit terms.",
      effort: "high",
      serviceLink: "https://turn2law.com/services/shareholders-agreement",
    },
  },
  {
    id: "fa-2",
    category: "Founder Agreements",
    categorySlug: "founder-agreements",
    text: "Is there a documented vesting schedule for founder equity?",
    helpText: "Vesting protects the company if a co-founder leaves early.",
    type: "yes_no",
    options: yesNo(100),
    weight: 3,
    riskLevel: "critical",
    recommendation: {
      title: "Implement Founder Vesting Schedule",
      whyItMatters: "If a co-founder departs in year 1 with their full equity block intact, it creates a deadweight cap table.",
      businessImpact: "Institutional investors mandate a standard 4-year vesting schedule with a 1-year cliff.",
      nextStep: "Incorporate reverse-vesting provisions into the founder agreement or SHA.",
      effort: "medium",
      serviceLink: "https://turn2law.com/services/founder-vesting",
    },
  },
  {
    id: "fa-3",
    category: "Founder Agreements",
    categorySlug: "founder-agreements",
    text: "Have all founders signed IP Assignment Agreements transferring their work to the company?",
    helpText: "Without IP assignment, founders may personally own the company's core technology.",
    type: "yes_no",
    options: yesNo(100),
    weight: 3,
    riskLevel: "critical",
    recommendation: {
      title: "Execute IP Assignment Agreements",
      whyItMatters: "Startups must hold clear title to all intellectual property to avoid ownership challenges.",
      businessImpact: "Due diligence failures regarding IP title assignment will stop any venture capital round.",
      nextStep: "Have all co-founders, developers, and designers execute proprietary information and IP assignment agreements.",
      effort: "low",
      serviceLink: "https://turn2law.com/services/ip-assignment",
    },
  },

  // ── Employment & HR ──
  {
    id: "hr-3",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Do you have a POSH (Prevention of Sexual Harassment) policy and Internal Committee?",
    helpText: "Mandatory for companies with 10+ employees under the POSH Act 2013.",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
    recommendation: {
      title: "Establish POSH Committee & Policy",
      whyItMatters: "Compliance with POSH is mandatory under Indian law once head-count exceeds 9. Penalties include fine and cancellation of business license.",
      businessImpact: "Mitigates liability risks and builds a safe, equitable workspace.",
      nextStep: "Draft POSH policy, constitute the Internal Committee (IC) with an external member, and run training workshops.",
      effort: "high",
      serviceLink: "https://turn2law.com/services/posh-compliance",
    },
  },

  // ── Intellectual Property ──
  {
    id: "ip-1",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    text: "Have you filed a trademark application for your brand name and logo?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
    recommendation: {
      title: "Secure Trademark Registration",
      whyItMatters: "Operating without trademark protection risks copycats stealing your brand equity or suing you for infringement.",
      businessImpact: "Protects your marketing investments and solidifies proprietary brand equity.",
      nextStep: "Conduct public search of trademark databases and file registration applications in applicable classes.",
      effort: "medium",
      serviceLink: "https://turn2law.com/services/trademark",
    },
  },

  // ── Data Privacy & IT Law ──
  {
    id: "dp-1",
    category: "Data Privacy & IT Law",
    categorySlug: "data-privacy",
    text: "Do you have a published Privacy Policy on your website/app?",
    type: "yes_no",
    options: yesNo(100),
    weight: 3,
    riskLevel: "critical",
    recommendation: {
      title: "Publish DPDP Act Compliant Privacy Policy",
      whyItMatters: "India's DPDP Act 2023 mandates that data fiduciaries provide clear notice and obtain consent before collecting user data.",
      businessImpact: "Violations under DPDP Act carry heavy statutory penalties (up to ₹250 crore).",
      nextStep: "Audit data inventory, map processing activities, and draft a DPDP compliant privacy policy and consent notice.",
      effort: "medium",
      serviceLink: "https://turn2law.com/services/privacy-compliance",
    },
  },

  // ── Sector-Specific Questions (SaaS) ──
  {
    id: "saas-1",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Do your customer terms include clear Service Level Agreements (SLAs) and data export clauses?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
    industryDependent: ["SaaS"],
    recommendation: {
      title: "Standardize SaaS Customer Agreements",
      whyItMatters: "Vague uptime commitments or missing liability caps expose SaaS providers to unlimited damage claims if services drop.",
      businessImpact: "Drafting robust terms reduces churn arguments and protects IP from customer reverse-engineering.",
      nextStep: "Review current customer master service agreements, add SLA metrics, and define data backup/export terms.",
      effort: "medium",
      serviceLink: "https://turn2law.com/services/saas-contracts",
    },
  },

  // ── Sector-Specific Questions (FinTech) ──
  {
    id: "fin-1",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Does your company have the required RBI licenses (e.g., Payment Aggregator, NBFC) or run on a compliant partner model?",
    type: "yes_no",
    options: yesNo(100),
    weight: 3,
    riskLevel: "critical",
    industryDependent: ["FinTech"],
    recommendation: {
      title: "Audit RBI Compliance & Licensing Structure",
      whyItMatters: "RBI heavily regulates digital lending, payments, and prepaid instruments. Running unlicensed operations is a criminal offense.",
      businessImpact: "Non-compliance can cause immediate service halts, freeze payment flows, and scare off bank partners.",
      nextStep: "Audit card storage, loan disbursement processes, and partner bank co-branding agreements for compliance check.",
      effort: "high",
      serviceLink: "https://turn2law.com/services/fintech-regulatory",
    },
  },

  // ── Sector-Specific Questions (E-commerce) ──
  {
    id: "ecom-1",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Are your platforms compliant with Consumer Protection (E-commerce) Rules, including refund disclosures and grievance officers?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
    industryDependent: ["E-commerce"],
    recommendation: {
      title: "Align with E-commerce Consumer Protection Rules",
      whyItMatters: "Mandated rules require displaying country of origin, return policy details, and contact for grievance officer prominently.",
      businessImpact: "Consumer court challenges and regulatory warnings can suspend operational merchant accounts.",
      nextStep: "Establish a grievance redressal channel and update product listings with country-of-origin details.",
      effort: "medium",
      serviceLink: "https://turn2law.com/services/ecommerce-compliance",
    },
  },

  // ── Sector-Specific Questions (Healthcare) ──
  {
    id: "health-1",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Are you compliant with telemedicine practice guidelines and electronic health record security standards?",
    type: "yes_no",
    options: yesNo(100),
    weight: 3,
    riskLevel: "critical",
    industryDependent: ["Healthcare"],
    recommendation: {
      title: "Establish Telemedicine & Health Data Protocols",
      whyItMatters: "Medical data is highly sensitive. Handling patient details without encryption breaches fundamental privacy rules.",
      businessImpact: "Fines under healthcare guidelines can shut down active clinical apps.",
      nextStep: "Incorporate doctor verification checkpoints and encrypt patient health records in database tables.",
      effort: "high",
      serviceLink: "https://turn2law.com/services/healthtech-regulatory",
    },
  },
];

export function getQuestionsByCategory(): Map<string, AssessmentQuestion[]> {
  const grouped = new Map<string, AssessmentQuestion[]>();
  for (const q of questions) {
    const existing = grouped.get(q.categorySlug) || [];
    existing.push(q);
    grouped.set(q.categorySlug, existing);
  }
  return grouped;
}

export function getCategoryQuestions(categorySlug: string): AssessmentQuestion[] {
  return questions.filter((q) => q.categorySlug === categorySlug);
}
