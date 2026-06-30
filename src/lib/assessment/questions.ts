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

// Yes/No helper
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
  },
  {
    id: "cf-2",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "What type of entity is your company registered as?",
    type: "single_choice",
    options: [
      { value: "pvt-ltd", label: "Private Limited Company", score: 100 },
      { value: "llp", label: "Limited Liability Partnership (LLP)", score: 85 },
      { value: "opc", label: "One Person Company (OPC)", score: 70 },
      { value: "partnership", label: "Partnership Firm", score: 40 },
      { value: "proprietorship", label: "Sole Proprietorship", score: 20 },
      { value: "not-registered", label: "Not yet registered", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "cf-3",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "Do you have a valid PAN and TAN for your company?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "cf-4",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "Is your company registered under the Shops & Establishment Act?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "medium",
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
  },
  {
    id: "cf-6",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "Are your annual ROC filings up to date (AOC-4, MGT-7)?",
    helpText: "Late filing attracts penalties and can lead to company strike-off.",
    type: "single_choice",
    options: [
      { value: "current", label: "Yes, fully up to date", score: 100 },
      { value: "partial", label: "Partially done / some pending", score: 40 },
      { value: "overdue", label: "Significantly overdue", score: 0 },
      { value: "na", label: "Not applicable (not incorporated)", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "cf-7",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "Do you have a registered office address with proper documentation?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "medium",
  },
  {
    id: "cf-8",
    category: "Company Formation & Registration",
    categorySlug: "company-formation",
    text: "Have you appointed a statutory auditor?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
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
  },
  {
    id: "fa-4",
    category: "Founder Agreements",
    categorySlug: "founder-agreements",
    text: "Is there a clear mechanism for resolving founder disputes?",
    type: "single_choice",
    options: [
      { value: "detailed", label: "Yes, detailed in SHA with arbitration clause", score: 100 },
      { value: "basic", label: "Basic verbal understanding exists", score: 30 },
      { value: "none", label: "No dispute resolution mechanism", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "fa-5",
    category: "Founder Agreements",
    categorySlug: "founder-agreements",
    text: "Do you have non-compete and non-solicitation clauses for co-founders?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "fa-6",
    category: "Founder Agreements",
    categorySlug: "founder-agreements",
    text: "Are founder roles, responsibilities, and decision-making authority documented?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "medium",
  },
  {
    id: "fa-7",
    category: "Founder Agreements",
    categorySlug: "founder-agreements",
    text: "Is there a documented process for a founder's exit or removal?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },

  // ── Employment & HR ──
  {
    id: "hr-1",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Do all employees have signed employment agreements?",
    type: "single_choice",
    options: [
      { value: "all", label: "Yes, all employees", score: 100 },
      { value: "most", label: "Most employees (some missing)", score: 50 },
      { value: "few", label: "Only key employees", score: 20 },
      { value: "none", label: "No formal agreements", score: 0 },
    ],
    weight: 3,
    riskLevel: "critical",
  },
  {
    id: "hr-2",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Are you registered for Provident Fund (PF) if you have 20+ employees?",
    helpText: "PF registration is mandatory for companies with 20 or more employees.",
    type: "single_choice",
    options: [
      { value: "registered", label: "Yes, registered and compliant", score: 100 },
      { value: "not-needed", label: "Not needed (less than 20 employees)", score: 100 },
      { value: "pending", label: "Registration pending", score: 30 },
      { value: "no", label: "Not registered", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "hr-3",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Do you have a POSH (Prevention of Sexual Harassment) policy and Internal Committee?",
    helpText: "Mandatory for companies with 10+ employees under the POSH Act 2013.",
    type: "single_choice",
    options: [
      { value: "full", label: "Yes, policy + IC + training", score: 100 },
      { value: "partial", label: "Policy exists but IC not formed", score: 40 },
      { value: "na", label: "Less than 10 employees", score: 80 },
      { value: "none", label: "No POSH compliance", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "hr-4",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Do employee contracts include confidentiality and IP assignment clauses?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "hr-5",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Do you have an employee handbook or HR policy document?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "medium",
  },
  {
    id: "hr-6",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Are contractor/freelancer agreements in place for all non-employees?",
    helpText: "Misclassifying employees as contractors can lead to legal liability.",
    type: "single_choice",
    options: [
      { value: "all", label: "Yes, for all contractors", score: 100 },
      { value: "some", label: "For some, not all", score: 40 },
      { value: "none", label: "No formal agreements", score: 0 },
      { value: "na", label: "We don't use contractors", score: 100 },
    ],
    weight: 2,
    riskLevel: "medium",
  },
  {
    id: "hr-7",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Are you compliant with minimum wage regulations for all workers?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "hr-8",
    category: "Employment & HR",
    categorySlug: "employment-hr",
    text: "Do you have a documented leave and attendance policy?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "low",
  },

  // ── Intellectual Property ──
  {
    id: "ip-1",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    text: "Have you filed a trademark application for your brand name and logo?",
    type: "single_choice",
    options: [
      { value: "registered", label: "Yes, trademark registered", score: 100 },
      { value: "filed", label: "Application filed, pending", score: 70 },
      { value: "planned", label: "Planning to file soon", score: 20 },
      { value: "no", label: "No trademark filed", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "ip-2",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    text: "Is your core technology/product covered by any patent filing?",
    type: "single_choice",
    options: [
      { value: "granted", label: "Patent granted", score: 100 },
      { value: "filed", label: "Patent application filed", score: 70 },
      { value: "not-patentable", label: "Not patentable (software/service)", score: 60 },
      { value: "no", label: "No patent protection", score: 10 },
    ],
    weight: 2,
    riskLevel: "medium",
  },
  {
    id: "ip-3",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    text: "Have you done a trademark search before finalizing your brand name?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "medium",
  },
  {
    id: "ip-4",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    text: "Is your domain name secured and does it match your trademark?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "medium",
  },
  {
    id: "ip-5",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    text: "Do you have procedures to protect trade secrets and confidential information?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "ip-6",
    category: "Intellectual Property",
    categorySlug: "intellectual-property",
    text: "Are you using open-source software with proper license compliance?",
    helpText: "Some open-source licenses (GPL, AGPL) can affect your IP if not handled correctly.",
    type: "single_choice",
    options: [
      { value: "audited", label: "Yes, we've audited OSS licenses", score: 100 },
      { value: "aware", label: "Aware but no formal audit", score: 40 },
      { value: "unknown", label: "Not sure about our OSS usage", score: 10 },
      { value: "no-oss", label: "We don't use open-source", score: 80 },
    ],
    weight: 2,
    riskLevel: "medium",
  },

  // ── Contracts & Commercial ──
  {
    id: "cc-1",
    category: "Contracts & Commercial",
    categorySlug: "contracts",
    text: "Do you have Terms of Service / Terms of Use for your product?",
    type: "yes_no",
    options: yesNo(100),
    weight: 3,
    riskLevel: "critical",
  },
  {
    id: "cc-2",
    category: "Contracts & Commercial",
    categorySlug: "contracts",
    text: "Do you use standardized vendor/supplier agreements?",
    type: "single_choice",
    options: [
      { value: "standard", label: "Yes, standard templates for all vendors", score: 100 },
      { value: "some", label: "For some vendors, informal for others", score: 40 },
      { value: "none", label: "No formal vendor agreements", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "cc-3",
    category: "Contracts & Commercial",
    categorySlug: "contracts",
    text: "Do you use NDAs when sharing confidential information with third parties?",
    type: "single_choice",
    options: [
      { value: "always", label: "Always, before any disclosure", score: 100 },
      { value: "sometimes", label: "Sometimes, inconsistently", score: 40 },
      { value: "never", label: "Rarely or never", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "cc-4",
    category: "Contracts & Commercial",
    categorySlug: "contracts",
    text: "Do your customer contracts include limitation of liability clauses?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "cc-5",
    category: "Contracts & Commercial",
    categorySlug: "contracts",
    text: "Is there a clear refund/cancellation policy documented for your customers?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "medium",
  },
  {
    id: "cc-6",
    category: "Contracts & Commercial",
    categorySlug: "contracts",
    text: "Are SLAs (Service Level Agreements) defined in your customer contracts?",
    type: "single_choice",
    options: [
      { value: "yes", label: "Yes, with specific metrics", score: 100 },
      { value: "basic", label: "Basic commitments, no formal SLA", score: 40 },
      { value: "no", label: "No SLAs defined", score: 0 },
      { value: "na", label: "Not applicable to our business", score: 80 },
    ],
    weight: 1,
    riskLevel: "medium",
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
  },
  {
    id: "dp-2",
    category: "Data Privacy & IT Law",
    categorySlug: "data-privacy",
    text: "Have you assessed compliance requirements under the DPDP Act 2023?",
    helpText: "India's Digital Personal Data Protection Act 2023 mandates data fiduciary obligations.",
    type: "single_choice",
    options: [
      { value: "compliant", label: "Yes, assessed and compliant", score: 100 },
      { value: "in-progress", label: "Assessment in progress", score: 50 },
      { value: "aware", label: "Aware but haven't started", score: 20 },
      { value: "unaware", label: "Not aware of requirements", score: 0 },
    ],
    weight: 3,
    riskLevel: "critical",
  },
  {
    id: "dp-3",
    category: "Data Privacy & IT Law",
    categorySlug: "data-privacy",
    text: "Do you collect explicit consent before processing personal data?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "dp-4",
    category: "Data Privacy & IT Law",
    categorySlug: "data-privacy",
    text: "Do you have a data breach notification procedure?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "dp-5",
    category: "Data Privacy & IT Law",
    categorySlug: "data-privacy",
    text: "Is personal data encrypted both in transit and at rest?",
    type: "single_choice",
    options: [
      { value: "both", label: "Yes, both in transit and at rest", score: 100 },
      { value: "transit", label: "In transit only (HTTPS)", score: 50 },
      { value: "rest", label: "At rest only", score: 40 },
      { value: "none", label: "No encryption measures", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "dp-6",
    category: "Data Privacy & IT Law",
    categorySlug: "data-privacy",
    text: "Do you have a Cookie Policy and consent mechanism on your website?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "medium",
  },
  {
    id: "dp-7",
    category: "Data Privacy & IT Law",
    categorySlug: "data-privacy",
    text: "Do you have Data Processing Agreements (DPAs) with third-party service providers?",
    type: "single_choice",
    options: [
      { value: "all", label: "Yes, with all data processors", score: 100 },
      { value: "some", label: "With some, not all", score: 40 },
      { value: "none", label: "No DPAs in place", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },

  // ── Regulatory & Compliance ──
  {
    id: "rc-1",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Are you registered for GST (if applicable)?",
    type: "single_choice",
    options: [
      { value: "registered", label: "Yes, registered and filing returns", score: 100 },
      { value: "exempt", label: "Below threshold / exempt category", score: 100 },
      { value: "pending", label: "Registration pending", score: 30 },
      { value: "no", label: "Should be registered but not done", score: 0 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "rc-2",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Are income tax returns filed on time for the company?",
    type: "yes_no",
    options: yesNo(100),
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "rc-3",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "If you handle payments/financial transactions, are you RBI compliant?",
    type: "single_choice",
    options: [
      { value: "compliant", label: "Yes, fully compliant", score: 100 },
      { value: "na", label: "Not applicable to our business", score: 100 },
      { value: "partial", label: "Partially compliant", score: 40 },
      { value: "no", label: "Not compliant", score: 0 },
    ],
    weight: 2,
    riskLevel: "critical",
  },
  {
    id: "rc-4",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Do you have any sector-specific licenses or registrations required for your industry?",
    helpText: "E.g., FSSAI for food, IRDAI for insurance, SEBI for financial services.",
    type: "single_choice",
    options: [
      { value: "all", label: "Yes, all required licenses obtained", score: 100 },
      { value: "some", label: "Some obtained, some pending", score: 50 },
      { value: "none", label: "Required but not obtained", score: 0 },
      { value: "na", label: "No special licenses needed", score: 100 },
    ],
    weight: 2,
    riskLevel: "high",
  },
  {
    id: "rc-5",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Have you conducted a board meeting in the last quarter?",
    helpText: "Private companies must hold at least 4 board meetings per year.",
    type: "single_choice",
    options: [
      { value: "regular", label: "Yes, regular quarterly meetings", score: 100 },
      { value: "irregular", label: "Meetings happen but not quarterly", score: 40 },
      { value: "none", label: "No formal board meetings", score: 0 },
      { value: "na", label: "Not applicable (not incorporated)", score: 0 },
    ],
    weight: 1,
    riskLevel: "medium",
  },
  {
    id: "rc-6",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "Are statutory registers and minutes books maintained?",
    type: "yes_no",
    options: yesNo(100),
    weight: 1,
    riskLevel: "medium",
  },
  {
    id: "rc-7",
    category: "Regulatory & Compliance",
    categorySlug: "regulatory",
    text: "If receiving foreign investment, have you complied with FEMA regulations?",
    type: "single_choice",
    options: [
      { value: "compliant", label: "Yes, fully FEMA compliant", score: 100 },
      { value: "na", label: "No foreign investment received", score: 100 },
      { value: "partial", label: "Partially compliant", score: 30 },
      { value: "no", label: "Not compliant", score: 0 },
    ],
    weight: 2,
    riskLevel: "critical",
  },
];

// Group questions by category
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
