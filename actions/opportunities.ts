"use server";

import { createClient } from "@/lib/supabase/server";
import type { Opportunity } from "@/types/opportunity";

export async function getOpportunities(typeFilter?: string, searchKeyword?: string): Promise<{
    opportunities: Opportunity[];
    userLevel: number;
}> {
    const supabase = createClient();

    // 1. Get User Profile Level
    const { data: { user } } = await supabase.auth.getUser();
    let userLevel = 1;

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("level")
            .eq("id", user.id)
            .single();
        if (profile) userLevel = profile.level || 1;
    }

    // 2. Fetch Opportunities
    let query = supabase
        .from("opportunities")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

    if (typeFilter && typeFilter !== "all") {
        query = query.eq("opportunity_type", typeFilter);
    }

    if (searchKeyword && searchKeyword.trim()) {
        const term = `%${searchKeyword.trim()}%`;
        query = query.or(`title.ilike.${term},organization.ilike.${term},description.ilike.${term}`);
    }

    const { data, error } = await query;

    if (error || !data) {
        console.error("Error fetching opportunities:", error);
        return { opportunities: fallbackOpportunities, userLevel };
    }

    // 3. Check which opportunities the user has applied for
    let userApplications: Set<string> = new Set();
    if (user) {
        const { data: apps } = await supabase
            .from("opportunity_applications")
            .select("opportunity_id")
            .eq("user_id", user.id);
        if (apps) {
            userApplications = new Set(apps.map(a => a.opportunity_id));
        }
    }

    const opportunities: Opportunity[] = data.map(item => ({
        ...item,
        skills_required: Array.isArray(item.skills_required) ? item.skills_required : [],
        user_has_applied: userApplications.has(item.id)
    }));

    return { opportunities, userLevel };
}

export async function applyForOpportunity(opportunityId: string, coverNote: string, portfolioLink?: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Authentication required to apply." };

    // Fetch opportunity to verify min_level
    const { data: opp, error: oppErr } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", opportunityId)
        .single();

    if (oppErr || !opp) return { success: false, error: "Opportunity position not found." };

    // Fetch user profile level
    const { data: profile } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", user.id)
        .single();

    const userLevel = profile?.level || 1;
    if (userLevel < opp.min_level_required) {
        return {
            success: false,
            error: `Level ${opp.min_level_required} qualification required. Your current level is ${userLevel}. Complete more lessons to level up!`
        };
    }

    // Insert Application
    const { error } = await supabase
        .from("opportunity_applications")
        .insert({
            opportunity_id: opportunityId,
            user_id: user.id,
            cover_note: coverNote,
            portfolio_link: portfolioLink || null,
            status: "pending"
        });

    if (error) {
        if (error.code === '23505') {
            return { success: false, error: "You have already submitted an application for this position." };
        }
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Fallback initial data in case DB table is not yet migrated
const fallbackOpportunities: Opportunity[] = [
    {
        id: "fallback-1",
        title: "Research Assistant — Satellite Crop Yield Prediction & ML Modeling",
        organization: "BAU Precision Agriculture & Remote Sensing Lab",
        opportunity_type: "ra_position",
        location: "Mymensingh / Hybrid",
        stipend_range: "30,000 - 35,000 BDT / month",
        description: "We are seeking an outstanding Insyt Academy Cadet to assist in processing Sentinel-2 & PlanetScope satellite imagery for paddy yield forecasting. You will write Google Earth Engine (GEE) scripts, perform NDVI time-series extraction, and build Machine Learning regression models in R.",
        skills_required: ["Google Earth Engine", "R Programming", "Satellite Remote Sensing", "Spatial ML"],
        min_level_required: 2,
        contact_email: "ra-lab@bau.edu.bd",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_featured: true,
        is_published: true,
        created_at: new Date().toISOString()
    },
    {
        id: "fallback-2",
        title: "Agronomic Data Science & Genomics Intern",
        organization: "International Rice Research Institute (CGIAR IRRI)",
        opportunity_type: "internship",
        location: "Dhaka / Hybrid",
        stipend_range: "25,000 BDT / month + Lab Perks",
        description: "Join IRRI Asia Hub as a Data Science Intern! Focus on phenotypic dataset cleaning, GWAS statistical modeling in R, and preparing interactive ggplot dashboards for climate-resilient rice crop varieties.",
        skills_required: ["R Programming", "Bioinformatics", "Statistical Modeling", "ggplot2"],
        min_level_required: 1,
        contact_email: "careers-asia@irri.org",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        is_featured: true,
        is_published: true,
        created_at: new Date().toISOString()
    },
    {
        id: "fallback-3",
        title: "Geospatial Soil Moisture & Drought Analytics Grant",
        organization: "FAO Bangladesh / Ministry of Agriculture",
        opportunity_type: "project_grant",
        location: "Remote",
        stipend_range: "$600 USD Project Grant",
        description: "Funded 2-month research grant for modeling soil moisture deficits across North-West Bangladesh during Aman season. Cadets will deliver GEE scripts, MODIS land surface temperature models, and a final technical report.",
        skills_required: ["Google Earth Engine", "Hydrological Modeling", "GIS Mapping"],
        min_level_required: 3,
        contact_email: "grants@fao-agri.org",
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        is_featured: false,
        is_published: true,
        created_at: new Date().toISOString()
    },
    {
        id: "fallback-4",
        title: "R & GEE Code Review Specialist (Cadet Peer Mentor)",
        organization: "Insyt Academy Research Division",
        opportunity_type: "gig",
        location: "100% Remote",
        stipend_range: "15,000 - 20,000 BDT / month (Part-time)",
        description: "Insyt Academy is hiring top-level cadets (Level 3+) to review user problem submissions in our new Arena, assist junior cadets in code debugging, and write sample solution scripts.",
        skills_required: ["R Programming", "Google Earth Engine", "Code Optimization", "Peer Mentorship"],
        min_level_required: 3,
        contact_email: "careers@insytacademy.com",
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        is_featured: true,
        is_published: true,
        created_at: new Date().toISOString()
    }
];
