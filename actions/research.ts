"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionWithRole, isStaffRole } from "@/lib/auth/assert-role";

function safeHttpsUrl(url?: string): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        return u.protocol === "https:" ? u.href : null;
    } catch {
        return null;
    }
}

export interface Author {
    name: string;
    institution: string;
}

export interface ResearchPaper {
    id: string;
    title: string;
    abstract: string;
    authors: Author[];
    doi: string | null;
    pdf_url?: string | null;
    dataset_url?: string | null;
    discipline: string;
    published_at: string;
}

// Fallback seed data in case Supabase is empty or not yet migrated
const fallbackPapers: ResearchPaper[] = [
    {
        id: "1",
        title: "Bioluminescent Gene Insertion in Oryza sativa",
        abstract: "A study on utilizing Luciferase enzyme coding sequences for real-time stress tracking in rice varieties under high salinity conditions.",
        authors: [
            { name: "Dr. Farhana Akter", institution: "BARI" },
            { name: "S. Rahman", institution: "INSYT Lab" }
        ],
        doi: "doi:10.1016/j.jbiotech.2026.02.011",
        pdf_url: "#",
        dataset_url: "#",
        discipline: "Bioinformatics",
        published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "2",
        title: "Machine Learning Models for Soil Salinity Forecasting",
        abstract: "Applying extreme gradient boosting architectures for soil salinity forecasting across coastal regions of Bangladesh.",
        authors: [
            { name: "M. Hasan", institution: "BAU" },
            { name: "K. Al-Fahim", institution: "AgriTech Dynamics" }
        ],
        doi: "doi:10.1109/tgrs.2026.04821",
        pdf_url: "#",
        dataset_url: "#",
        discipline: "Crop Science",
        published_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "3",
        title: "Mangrove Canopy Classification Using Drone multispectral Imagery",
        abstract: "Using high-resolution multispectral imagery captured by autonomous UAVs to classify Sundarbans canopy cover anomalies.",
        authors: [
            { name: "Dr. A. Chowdhury", institution: "KU Forestry Dept" }
        ],
        doi: "doi:10.1080/01431161.2026.0911",
        pdf_url: "#",
        dataset_url: "#",
        discipline: "Forestry",
        published_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export async function getResearchPapers(): Promise<ResearchPaper[]> {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("research_papers")
            .select("*")
            .order("published_at", { ascending: false });

        if (error || !data || data.length === 0) {
            console.warn("Supabase research papers fetch failed or returned empty. Using fallback seed data.");
            return fallbackPapers;
        }

        // Parse authors safely if needed (Postgres stores as JSONB, which comes out parsed automatically)
        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            abstract: item.abstract,
            authors: typeof item.authors === "string" ? JSON.parse(item.authors) : item.authors,
            doi: item.doi,
            pdf_url: item.pdf_url,
            dataset_url: item.dataset_url,
            discipline: item.discipline,
            published_at: item.published_at
        }));

    } catch (err) {
        console.error("Error loading research papers:", err);
        return fallbackPapers;
    }
}

export async function submitPreprint(data: {
    title: string;
    abstract: string;
    authors: Author[];
    doi?: string;
    pdf_url?: string;
    dataset_url?: string;
    discipline: string;
}): Promise<{ success?: boolean; error?: string }> {
    // Publishing to the public research feed is staff-only (defense-in-depth on
    // top of the RLS insert policy).
    const { user, role } = await getSessionWithRole();
    if (!user) return { error: "Unauthorized. Please log in to submit a preprint." };
    if (!isStaffRole(role ?? "student")) {
        return { error: "Only instructors or admins can publish research." };
    }

    if (!data.title?.trim() || !data.abstract?.trim() || !data.discipline?.trim() || !data.authors?.length) {
        return { error: "Title, abstract, discipline, and at least one author are required." };
    }

    // URLs must be https (blocks javascript:/data: and insecure links).
    const pdfUrl = safeHttpsUrl(data.pdf_url);
    const datasetUrl = safeHttpsUrl(data.dataset_url);
    if (data.pdf_url && !pdfUrl) return { error: "PDF URL must be a valid https:// link." };
    if (data.dataset_url && !datasetUrl) return { error: "Dataset URL must be a valid https:// link." };

    const supabase = createClient();
    const { error } = await supabase
        .from("research_papers")
        .insert({
            title: data.title.slice(0, 300),
            abstract: data.abstract.slice(0, 5000),
            authors: data.authors,
            doi: data.doi || null,
            pdf_url: pdfUrl,
            dataset_url: datasetUrl,
            discipline: data.discipline,
            published_at: new Date().toISOString(),
            submitted_by: user.id,
        });

    if (error) {
        console.error("Failed to submit preprint:", error);
        return { error: "Could not submit the preprint. Please try again." };
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/academy/research");

    return { success: true };
}
