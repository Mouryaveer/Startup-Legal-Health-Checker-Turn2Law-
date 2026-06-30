-- ============================================================
-- Turn2Law Startup Legal Health Check — Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'Building2',
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- QUESTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  category_slug TEXT REFERENCES categories(slug) ON DELETE CASCADE,
  text TEXT NOT NULL,
  help_text TEXT,
  type TEXT NOT NULL CHECK (type IN ('yes_no', 'single_choice', 'multi_choice', 'scale')),
  options JSONB NOT NULL DEFAULT '[]',
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight >= 1 AND weight <= 3),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
  industry_dependent TEXT[] DEFAULT '{}',
  conditional_parent_id TEXT,
  conditional_value TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  recommendation JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{}',
  overall_score DECIMAL(5,2),
  risk_level TEXT,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ASSESSMENT LEADS (CRM)
-- ============================================================
CREATE TABLE IF NOT EXISTS assessment_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  founder_name TEXT,
  pipeline_stage TEXT DEFAULT 'new' CHECK (pipeline_stage IN ('new','contacted','qualified','proposal','client','lost')),
  assigned_to TEXT,
  notes JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO categories (slug, name, description, icon, weight, sort_order)
VALUES
  ('company-formation', 'Company Formation & Registration', 'Incorporation status, DPIIT registration, and statutory registrations.', 'Building2', 1.20, 10),
  ('founder-agreements', 'Founder Agreements', 'Shareholder agreements, vesting schedules, IP assignments, and co-founder documentation.', 'Users', 1.30, 20),
  ('employment-hr', 'Employment & HR', 'Employment contracts, PF/ESI compliance, POSH policy, and workplace regulations.', 'UserCheck', 1.10, 30),
  ('intellectual-property', 'Intellectual Property', 'Trademark registration, patent filings, copyright protection, and trade secrets.', 'Lightbulb', 1.00, 40),
  ('contracts', 'Contracts & Commercial', 'Customer terms, vendor agreements, NDAs, and commercial contract frameworks.', 'FileSignature', 1.00, 50),
  ('data-privacy', 'Data Privacy & IT Law', 'Privacy policy, DPDP Act compliance, IT Act provisions, and data handling practices.', 'Lock', 1.20, 60),
  ('regulatory', 'Regulatory & Compliance', 'GST registration, RBI compliance, sector-specific regulations, and annual filings.', 'Scale', 1.00, 70)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon, weight = EXCLUDED.weight, sort_order = EXCLUDED.sort_order;

INSERT INTO questions (id, category_slug, text, help_text, type, options, weight, risk_level, industry_dependent, conditional_parent_id, conditional_value, is_active, sort_order, recommendation)
VALUES
  ('cf-1', 'company-formation', 'Is your company incorporated (Private Limited, LLP, or OPC)?', 'Incorporation gives your startup a separate legal identity and limits personal liability.', 'yes_no', '[{"value": "yes", "score": 100, "label": "Yes"}, {"value": "no", "score": 0, "label": "No"}]'::jsonb, 3, 'critical', '{}', NULL, NULL, true, 10, '{"title": "Register your company entity", "effort": "high", "nextStep": "Incorporate as a Private Limited Company. Draft custom MoA/AoA representing your business objectives.", "serviceLink": "https://turn2law.com/services/incorporation", "whyItMatters": "Unincorporated startups expose founders to unlimited personal liability and cannot raise institutional capital.", "businessImpact": "Investors require a clean corporate structure (preferably Private Limited) before deploying funds."}'::jsonb),
  ('cf-2', 'company-formation', 'What type of entity is your company registered as?', 'Select entity type.', 'single_choice', '[{"value": "pvt-ltd", "score": 100, "label": "Private Limited Company"}, {"value": "llp", "score": 85, "label": "Limited Liability Partnership (LLP)"}, {"value": "opc", "score": 70, "label": "One Person Company (OPC)"}, {"value": "partnership", "score": 40, "label": "Partnership Firm"}, {"value": "proprietorship", "score": 20, "label": "Sole Proprietorship"}]'::jsonb, 2, 'high', '{}', 'cf-1', 'yes', true, 20, '{"title": "Convert entity type to Private Limited", "effort": "high", "nextStep": "Initiate conversion of your partnership/LLP into a Private Limited company.", "serviceLink": "https://turn2law.com/services/company-conversion", "whyItMatters": "Partnerships or sole proprietorships do not allow equity allocation, stock option pools (ESOPs), or venture capital investment.", "businessImpact": "Venture capitalists will not invest in LLPs or partnerships due to structural limitations."}'::jsonb),
  ('cf-5', 'company-formation', 'Have you registered for DPIIT Startup Recognition?', 'DPIIT recognition unlocks tax benefits, self-certification, and government tenders.', 'yes_no', '[{"value": "yes", "score": 100, "label": "Yes"}, {"value": "no", "score": 0, "label": "No"}]'::jsonb, 2, 'medium', '{}', NULL, NULL, true, 30, '{"title": "Apply for DPIIT Recognition", "effort": "medium", "nextStep": "Prepare pitch deck and write-up to submit for DPIIT recognition on the Startup India portal.", "serviceLink": "https://turn2law.com/services/dpiit-registration", "whyItMatters": "DPIIT recognition offers substantial tax exemptions (like Section 80-IAC) and simplified compliance filing procedures.", "businessImpact": "Reduces corporate tax liabilities for a consecutive block of three years."}'::jsonb),
  ('fa-1', 'founder-agreements', 'Do you have a signed Shareholders'' Agreement (SHA) between all co-founders?', 'An SHA defines ownership, decision rights, exit clauses, and conflict resolution.', 'yes_no', '[{"value": "yes", "score": 100, "label": "Yes"}, {"value": "no", "score": 0, "label": "No"}]'::jsonb, 3, 'critical', '{}', NULL, NULL, true, 40, '{"title": "Draft Shareholders'' Agreement", "effort": "high", "nextStep": "Retain legal counsel to draft an SHA specifying decision thresholds, transfer restrictions, and exit terms.", "serviceLink": "https://turn2law.com/services/shareholders-agreement", "whyItMatters": "Co-founder disputes without an SHA often result in deadlock and business failure.", "businessImpact": "Clean governance structures mitigate risks of litigation and make the cap table investor-friendly."}'::jsonb)
ON CONFLICT (id) DO UPDATE
SET category_slug = EXCLUDED.category_slug, text = EXCLUDED.text, help_text = EXCLUDED.help_text, type = EXCLUDED.type, options = EXCLUDED.options, weight = EXCLUDED.weight, risk_level = EXCLUDED.risk_level, industry_dependent = EXCLUDED.industry_dependent, conditional_parent_id = EXCLUDED.conditional_parent_id, conditional_value = EXCLUDED.conditional_value, is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order, recommendation = EXCLUDED.recommendation;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level ON assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_assessments_overall_score ON assessments(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_stage ON assessment_leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_leads_company_name ON assessment_leads(company_name);
CREATE INDEX IF NOT EXISTS idx_leads_email ON assessment_leads(email);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================
CREATE POLICY "Anyone can submit assessments" ON assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read assessment by ID" ON assessments FOR SELECT USING (true);
CREATE POLICY "Anyone can submit leads" ON assessment_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true);
