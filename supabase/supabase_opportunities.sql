-- ================================================================================================
-- INSYT ACADEMY — OPPORTUNITIES & TALENT MARKETPLACE SCHEMA
-- ================================================================================================

-- 1. Create opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('ra_position', 'internship', 'full_time', 'project_grant', 'gig')),
    location TEXT NOT NULL,
    stipend_range TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_required JSONB NOT NULL DEFAULT '[]'::jsonb,
    min_level_required INTEGER NOT NULL DEFAULT 1,
    contact_email TEXT NOT NULL,
    deadline TIMESTAMPTZ,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create opportunity_applications table
CREATE TABLE IF NOT EXISTS public.opportunity_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_note TEXT NOT NULL,
    portfolio_link TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'shortlisted', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (opportunity_id, user_id)
);

-- Enable RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;

-- Read policies: Published opportunities are visible to all authenticated users
CREATE POLICY "Authenticated users can read published opportunities"
    ON public.opportunities FOR SELECT
    TO authenticated
    USING (is_published = TRUE);

-- Application policies: Cadets can read their own applications
CREATE POLICY "Cadets can view own applications"
    ON public.opportunity_applications FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Application policies: Cadets can insert their own application
CREATE POLICY "Cadets can apply for opportunities"
    ON public.opportunity_applications FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- ================================================================================================
-- SEED INITIAL OPPORTUNITIES DATA
-- ================================================================================================

INSERT INTO public.opportunities (title, organization, opportunity_type, location, stipend_range, description, skills_required, min_level_required, contact_email, deadline, is_featured)
VALUES 
(
    'Research Assistant — Satellite Crop Yield Prediction & ML Modeling',
    'BAU Precision Agriculture & Remote Sensing Lab',
    'ra_position',
    'Mymensingh / Hybrid',
    '30,000 - 35,000 BDT / month',
    'We are seeking an outstanding Insyt Academy Cadet to assist in processing Sentinel-2 & PlanetScope satellite imagery for paddy yield forecasting. You will write Google Earth Engine (GEE) scripts, perform NDVI time-series extraction, and build Machine Learning regression models in R.',
    '["Google Earth Engine", "R Programming", "Satellite Remote Sensing", "Spatial ML"]'::jsonb,
    2,
    'ra-lab@bau.edu.bd',
    NOW() + INTERVAL '30 days',
    TRUE
),
(
    'Agronomic Data Science & Genomics Intern',
    'International Rice Research Institute (CGIAR IRRI)',
    'internship',
    'Dhaka / Hybrid',
    '25,000 BDT / month + Lab Perks',
    'Join IRRI Asia Hub as a Data Science Intern! Focus on phenotypic dataset cleaning, GWAS statistical modeling in R, and preparing interactive ggplot dashboards for climate-resilient rice crop varieties.',
    '["R Programming", "Bioinformatics", "Statistical Modeling", "ggplot2"]'::jsonb,
    1,
    'careers-asia@irri.org',
    NOW() + INTERVAL '45 days',
    TRUE
),
(
    'Geospatial Soil Moisture & Drought Analytics Grant',
    'FAO Bangladesh / Ministry of Agriculture',
    'project_grant',
    'Remote',
    '$600 USD Project Grant',
    'Funded 2-month research grant for modeling soil moisture deficits across North-West Bangladesh during Aman season. Cadets will deliver GEE scripts, MODIS land surface temperature models, and a final technical report.',
    '["Google Earth Engine", "Hydrological Modeling", "GIS Mapping"]'::jsonb,
    3,
    'grants@fao-agri.org',
    NOW() + INTERVAL '15 days',
    FALSE
),
(
    'R & GEE Code Review Specialist (Cadet Peer Mentor)',
    'Insyt Academy Research Division',
    'gig',
    '100% Remote',
    '15,000 - 20,000 BDT / month (Part-time)',
    'Insyt Academy is hiring top-level cadets (Level 3+) to review user problem submissions in our new Arena, assist junior cadets in code debugging, and write sample solution scripts.',
    '["R Programming", "Google Earth Engine", "Code Optimization", "Peer Mentorship"]'::jsonb,
    3,
    'careers@insytacademy.com',
    NOW() + INTERVAL '60 days',
    TRUE
)
ON CONFLICT DO NOTHING;
