# INSYT.BAU Academic OS — Transformation & Architecture Report

## 1. Executive Summary

**INSYT.BAU** is an AI-native academic intelligence and learning operating system tailored specifically to **Bangladesh Agricultural University (BAU), Mymensingh**. 

Rather than serving as a generic online video course portal, INSYT.BAU resolves real student friction points across the university's 6 faculties and 44 departments:
- Routine and notice fragmentation across departmental notice boards.
- High-stakes oral defense (viva voce) anxiety.
- Complex laboratory specimen identification in field practicals.
- Grade projection ambiguity under the official BAU 10/20/70 Academic Ordinance.
- Missing prerequisite mapping between Level 1 foundation courses and career recruitment exams (BCS Agriculture Cadre, NARS Scientific Officer).

---

## 2. Gemini & ElevenLabs AI Systems Architecture

```
                                    ┌────────────────────────┐
                                    │    INSYT.BAU Client    │
                                    │  Next.js 14 App Router │
                                    └───────────┬────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
    ┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
    │ Gemini 1.5 Flash Vision│     │  Gemini 1.5 Flash Text │     │  ElevenLabs Streaming  │
    │  Multimodal Diagnostic │     │  Syllabus & Reasoning  │     │   Voice Oral Defense   │
    ├────────────────────────┤     ├────────────────────────┤     ├────────────────────────┤
    │ • Routine PDF OCR      │     │ • 10/20/70 Assessment  │     │ • Conversational Viva  │
    │ • Leaf Blight Vision   │     │ • Statistical LaTeX RAG│     │ • Audio feedback turns │
    │ • Parasite Microscopy  │     │ • Prerequisite DAG Rec │     │ • Natural examiner voice│
    └────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

### 2.1 Google Gemini API Core Responsibilities
1. **Multimodal Document Intelligence (`actions/bau-schedule.ts`):** Ingests official faculty routine PDFs, extracts room allocations, time blocks, and group designations, and identifies scheduling conflicts.
2. **Multimodal Specimen Vision (`actions/bau-field-ai.ts`):** Analyzes agricultural foliar lesions (Rice Blast, Bacterial Blight) and veterinary slides, mapping them to BAU laboratory exercise protocols.
3. **Syllabus-Grounded Tutor (`actions/bau-tutor.ts`):** Uses syllabus data to explain statistical derivations (RCBD ANOVA, pooled variance, OLS regression) with LaTeX rendering.
4. **Viva Oral Evaluation (`actions/bau-viva.ts`):** Scores student spoken answers on a 4-dimensional rubric: Technical Accuracy, Conceptual Depth, Logical Reasoning, and Spoken Fluency.
5. **Ordinance & CGPA Target Engine (`actions/bau-assessment.ts`):** Projects semester GPA and calculates the exact final exam score required to meet target CGPA goals.

### 2.2 ElevenLabs Voice Integration
1. **Spoken Viva Examiner (`app/api/viva/voice/route.ts`):** Streams natural speech for oral question prompts and spoken examiner feedback directly to the browser.
2. **Deterministic Fallbacks:** If API quotas or network constraints occur, the client gracefully falls back to the browser's Web Speech API, guaranteeing a 100% reliable demo presentation.

---

## 3. Academic Data Provenance & Real BAU Structure

All academic data was structured from official BAU sources and institutional repositories:
- **6 Degree-Awarding Faculties:** Faculty of Agriculture (`FOA`), Veterinary Science (`FVS`), Animal Husbandry (`FAH`), Agricultural Economics & Rural Sociology (`FAERS`), Agricultural Engineering & Technology (`FAET`), and Fisheries (`FOF`).
- **44 Academic Departments:** Including Agricultural Statistics, Agricultural Economics, Agronomy, Plant Pathology, Microbiology & Hygiene, Animal Breeding & Genetics, Aquaculture, Farm Power & Machinery.
- **BAU 10/20/70 Ordinance:** 10 Marks Attendance + 20 Marks Continuous Assessment / Class Tests + 70 Marks Semester Final Exam.
- **Faculty Research Publication Corpus:** Scopus/Web of Science indexed articles authored by real BAU professors with empirical methodology stacks and thesis gap hints.

---

## 4. Feature Summary & Verification Matrix

| Feature Module | Route | Underlying AI / Tech | Verified Behavior |
| :--- | :--- | :--- | :--- |
| **Command Center Dashboard** | `/academy` | Telemetry HUD + Live State | Today's schedule, remedial sprint card, active course progress, urgent assessment alerts. |
| **Schedule Intelligence** | `/academy/schedule` | Gemini Multimodal PDF Parser | Drops routine PDF/image, extracts timetable, detects room/time clashes across Groups A & B. |
| **Spoken AI Viva Voce** | `/academy/viva` | ElevenLabs + Gemini 1.5 | Full oral examination room with live speech recognition, waveform visualizer, and 4D rubric scorecard. |
| **Field & Specimen AI** | `/academy/field-lab` | Gemini 1.5 Flash Vision | Multimodal disease diagnosis, visual morphological findings, and laboratory exercise guidance. |
| **10/20/70 Exam Lab** | `/academy/assessment` | BAU Ordinance Simulator | Interactive attendance/continuous/final sliders, CGPA simulator, and LaTeX mock exams. |
| **Course Workspace & Tutor** | `/academy/courses/[slug]` | Gemini Syllabus RAG + KaTeX | Complete syllabus modules, objectives, practicals, and slide-out LaTeX course tutor drawer. |
| **Prerequisite DAG** | `/academy/skills` | Directed Acyclic Graph | Visual Level 1–4 course dependency graph with career unlocks. |
| **Research Intelligence** | `/research` | BAU Faculty Corpus | Real papers, empirical methodologies (R/Stata), and thesis research gap finder. |
| **Career Bridge** | `/opportunities` | Academic Career Mapping | Course $\rightarrow$ Skill $\rightarrow$ Career roadmaps for BCS Cadre, NARS institutes, and foreign fellowships. |
| **Academic Onboarding** | `/onboarding` | 3-Step Profile Customizer | Selects Faculty, Department, Level/Semester, and target career goals. |
