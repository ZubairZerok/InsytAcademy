// lib/bau-data/careers.ts
// Career Bridge: Direct Mapping of BAU Courses & Skills to Bangladesh Public & International Opportunities.
// Provenance: Bangladesh Public Service Commission (BPSC), NARS Institutes (BARI/BRRI/BINA/BLRI), and Graduate Pathways.

import type { CareerPathway } from "@/types/bau";

export const BAU_CAREER_PATHWAYS: CareerPathway[] = [
    {
        id: "car-bcs-agri",
        roleTitle: "Upazila Agriculture Officer (UAO) / BCS Agriculture Cadre",
        category: "Government Cadre (BCS)",
        organizationExamples: ["Department of Agricultural Extension (DAE)", "Ministry of Agriculture", "BADC"],
        requiredDegree: "B.Sc. Agriculture (Hons.)",
        targetDepartments: ["AGRON", "SS", "HORT", "PPATH", "ENTOM", "AGEXT"],
        keyRequiredCourses: ["AGRON 1101", "SS 1103", "PPATH 2101", "ENTOM 2101", "AGEXT 3101"],
        coreSkills: ["Cropping System Planning", "Plant Disease Identification", "Integrated Pest Management (IPM)", "Extension Advisory", "Agricultural Policy Execution"],
        salaryRangeBDT: "Grade-9 (BDT 35,000 – 65,000+ allowance & government accommodation)",
        roadmapSteps: [
            { step: 1, title: "Master Core Agronomy & Soil Syllabi", description: "Attain strong conceptual mastery of AEZs, crop growth stages, and fertilizer recommendation guides." },
            { step: 2, title: "Field Practical Proficiency", description: "Acquire hands-on expertise in identifying 50+ crop diseases and physiological disorders in BAU Field Labs." },
            { step: 3, title: "BCS Preliminary & Subject-Wise Written Prep", description: "Synthesize agricultural economics, national food policy, and technical agronomy questions." }
        ]
    },
    {
        id: "car-nars-scientist",
        roleTitle: "Scientific Officer (Agricultural & Life Science Research)",
        category: "Research Institutes (BARI/BRRI/BLRI)",
        organizationExamples: ["Bangladesh Agricultural Research Institute (BARI)", "Bangladesh Rice Research Institute (BRRI)", "BINA", "BLRI", "BFRI"],
        requiredDegree: "B.Sc. Agriculture / B.Sc. AH / DVM / B.Sc. Fisheries / B.Sc. Agri Eng",
        targetDepartments: ["AGRON", "GPB", "STAT", "BMB", "ABG", "AQ", "VMH"],
        keyRequiredCourses: ["AAS 2107", "GPB 2101", "BMB 2101", "AGRON 1101"],
        coreSkills: ["Statistical Field Experiment Design (RCBD, Alpha Lattice)", "ANOVA & Post-Hoc LSD in R", "Molecular Marker Assisted Breeding", "Scientific Manuscript Writing"],
        salaryRangeBDT: "Grade-9 (BDT 38,000 – 70,000 + NARS Research Allowances)",
        roadmapSteps: [
            { step: 1, title: "Statistical Inference & Experimental Design", description: "Achieve distinction in AAS 2107. Learn R programming for multi-location trial analysis." },
            { step: 2, title: "Undergraduate / MS Thesis Engagement", description: "Publish an indexed peer-reviewed journal paper with your BAU departmental supervisor." },
            { step: 3, title: "NARS Recruitment Examination", description: "Excel in written technical exams focusing on genetics, plant pathology, and biometrics." }
        ]
    },
    {
        id: "car-vet-surgeon",
        roleTitle: "Veterinary Surgeon (BCS Livestock Cadre & Private Clinical Practice)",
        category: "Government Cadre (BCS)",
        organizationExamples: ["Department of Livestock Services (DLS)", "Central Veterinary Hospital", "CP Five Star", "Kazi Farms Group"],
        requiredDegree: "Doctor of Veterinary Medicine (DVM)",
        targetDepartments: ["VM", "VSO", "VPATH", "VMH", "VPAR", "VPHA"],
        keyRequiredCourses: ["VMH 2101", "VPAR 2101", "VM 3101", "VSO 3101"],
        coreSkills: ["Small & Large Animal Surgery", "Epidemiological Outbreak Investigation", "Vaccine Cold Chain Management", "Antimicrobial Stewardship", "Zoonotic Disease Control"],
        salaryRangeBDT: "Grade-9 + Non-Practicing Allowances (BDT 40,000 – 75,000)",
        roadmapSteps: [
            { step: 1, title: "Clinical Medicine & Surgery Mastery", description: "Complete hands-on clinical rotations at the BAU Veterinary Teaching Hospital." },
            { step: 2, title: "Internship & Field Pathology", description: "Conduct farm-level disease diagnostics across commercial dairy and poultry hubs." },
            { step: 3, title: "BCS Livestock Special Written Exam", description: "Demonstrate high technical viva proficiency on pharmacology and livestock ordinances." }
        ]
    },
    {
        id: "car-agri-data-economist",
        roleTitle: "Agri-Data Analyst & Economic Policy Specialist",
        category: "AgTech & Corporate",
        organizationExamples: ["iFarmer", "bKash Agri-Fintech", "FAO Bangladesh", "World Bank Group", "ACI Agribusiness"],
        requiredDegree: "B.Sc. Agricultural Economics / B.Sc. Agri Engineering",
        targetDepartments: ["AE", "STAT", "AF", "AM", "CSM"],
        keyRequiredCourses: ["AAS 2107", "AE 2111", "AF 2103", "STAT 3105"],
        coreSkills: ["Econometric Time-Series Analysis (VECM, GARCH)", "R & Python Data Pipelines", "Agricultural Price Volatility Forecasting", "Impact Evaluation (PSM/DID)", "Power BI Dashboards"],
        salaryRangeBDT: "BDT 50,000 – 120,000 (Corporate & Development Sector)",
        roadmapSteps: [
            { step: 1, title: "Advanced Microeconomics & Production Theory", description: "Build deep proficiency in Cobb-Douglas production functions and price transmission dynamics (AE 2111)." },
            { step: 2, title: "Data Lab & Statistical Computing", description: "Build reproducible R analysis portfolios in the INSYT Code Lab." },
            { step: 3, title: "AgTech Project Grant & Industry Internships", description: "Apply econometric models to live market data from Bangladesh haor and char regions." }
        ]
    },
    {
        id: "car-international-fellow",
        roleTitle: "International Research Fellow (MS / PhD Abroad)",
        category: "International Fellowship & Higher Studies",
        organizationExamples: ["Erasmus Mundus (EU)", "DAAD (Germany)", "Australia Awards", "Monbukagakusho (Japan)", "Fulbright (USA)"],
        requiredDegree: "Any BAU Undergraduate Degree with CGPA >= 3.60",
        targetDepartments: ["All 44 Departments"],
        keyRequiredCourses: ["AAS 2107", "Course-specific Major Courses"],
        coreSkills: ["Academic Research Proposal Writing", "Reproducible Statistical Pipelines in R", "English Academic Viva Fluency", "Literature Synthesis"],
        salaryRangeBDT: "Fully Funded Monthly Stipend (EUR 1,200 – 2,500 / USD 2,000 – 3,200)",
        roadmapSteps: [
            { step: 1, title: "Target High Cumulative GPA (3.60+)", description: "Optimize 10/20/70 continuous assessment and final exam preparation using the INSYT Assessment Lab." },
            { step: 2, title: "Spoken AI Viva Practice", description: "Train with the ElevenLabs AI Viva room to sharpen spoken technical defense and fluency." },
            { step: 3, title: "Literature Matrix & Thesis Synthesis", description: "Use the BAU Research OS to identify novel research gaps in South Asian climate-smart agriculture." }
        ]
    }
];

export function getCareerById(id: string): CareerPathway | undefined {
    return BAU_CAREER_PATHWAYS.find(c => c.id === id);
}

export function getCareersByDepartment(deptCode: string): CareerPathway[] {
    return BAU_CAREER_PATHWAYS.filter(c => c.targetDepartments.includes(deptCode.toUpperCase()) || c.targetDepartments.includes("ALL 44 DEPARTMENTS"));
}
