-- ============================================================
-- Turn2Law Startup Legal Health Check — Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

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

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Assessments: Public insert (anyone can complete a check)
CREATE POLICY "Anyone can submit assessments"
  ON assessments FOR INSERT
  WITH CHECK (true);

-- Assessments: Public read by ID (for results page)
CREATE POLICY "Anyone can read assessment by ID"
  ON assessments FOR SELECT
  USING (true);

-- Leads: Public insert (anyone can be added as a lead)
CREATE POLICY "Anyone can submit leads"
  ON assessment_leads FOR INSERT
  WITH CHECK (true);

-- Admin full access via service role key (bypasses RLS automatically)
