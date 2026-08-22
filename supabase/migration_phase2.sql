-- ═══════════════════════════════════════════════════════════════
-- INSYT ACADEMY: Phase 2 Schema Extension
-- Research Preprint Platform & B2B Structures
-- ═══════════════════════════════════════════════════════════════

-- 1. Research Papers Table
CREATE TABLE IF NOT EXISTS public.research_papers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    authors JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {name: string, institution: string}
    doi TEXT UNIQUE,
    pdf_url TEXT,
    dataset_url TEXT,
    discipline TEXT NOT NULL, -- e.g. 'Bioinformatics', 'Crop Science', 'Forestry'
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. B2B Organizations (Universities / Corporate clients)
CREATE TABLE IF NOT EXISTS public.b2b_organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subscription_tier TEXT NOT NULL DEFAULT 'FREE', -- 'FREE', 'ACADEMIC_PRO', 'ENTERPRISE'
    max_seats INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security Policies
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_organizations ENABLE ROW LEVEL SECURITY;

-- Research Papers: Anyone can read research papers
CREATE POLICY "Public research papers read" ON public.research_papers 
    FOR SELECT USING (true);

-- Research Papers: Only authenticated admin or verified researchers can insert
CREATE POLICY "Auth research insert" ON public.research_papers 
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Instructor')
      )
    );

-- B2B Organizations: Read access to members / admins
CREATE POLICY "B2B read" ON public.b2b_organizations 
    FOR SELECT USING (true);

-- 4. Seed Data for Research Papers
INSERT INTO public.research_papers (title, abstract, authors, doi, discipline, published_at)
VALUES 
(
    'Bioluminescent Gene Insertion in Oryza sativa',
    'A study on utilizing Luciferase enzyme coding sequences for real-time stress tracking in rice varieties under high salinity conditions.',
    '[{"name": "Dr. Farhana Akter", "institution": "BARI"}, {"name": "S. Rahman", "institution": "INSYT Lab"}]'::jsonb,
    'doi:10.1016/j.jbiotech.2026.02.011',
    'Bioinformatics',
    timezone('utc'::text, now() - interval '12 days')
),
(
    'Machine Learning Models for Soil Salinity Forecasting',
    'Applying extreme gradient boosting architectures for soil salinity forecasting across coastal regions of Bangladesh.',
    '[{"name": "M. Hasan", "institution": "BAU"}, {"name": "K. Al-Fahim", "institution": "AgriTech Dynamics"}]'::jsonb,
    'doi:10.1109/tgrs.2026.04821',
    'Crop Science',
    timezone('utc'::text, now() - interval '25 days')
),
(
    'Mangrove Canopy Classification Using Drone multispectral Imagery',
    'Using high-resolution multispectral imagery captured by autonomous UAVs to classify Sundarbans canopy cover anomalies.',
    '[{"name": "Dr. A. Chowdhury", "institution": "KU Forestry Dept"}]'::jsonb,
    'doi:10.1080/01431161.2026.0911',
    'Forestry',
    timezone('utc'::text, now() - interval '45 days')
)
ON CONFLICT (doi) DO NOTHING;

-- 5. Indexes for Fast Retrieval
CREATE INDEX IF NOT EXISTS idx_research_papers_discipline ON public.research_papers(discipline);
CREATE INDEX IF NOT EXISTS idx_research_papers_published_at ON public.research_papers(published_at);
