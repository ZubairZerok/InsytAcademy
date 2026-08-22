# INSYT BAU — Comprehensive Codebase Audit & Architectural Reconnaissance
**Document ID:** BAU-AUDIT-v1.0  
**Classification:** Product Transformation & Technical Architecture Audit  
**Target:** Bangladesh Agricultural University (BAU) AI-Native Academic OS  
**Date:** August 2026  

---

## 1. Executive Summary & Current Architecture
The current repository is a fork of **INSYT Academy** (built on Next.js 14.2 App Router, React 18, TypeScript, Tailwind CSS, Supabase SSR/PostgreSQL, Framer Motion, and Monaco Editor).

The codebase was originally designed as a generic gamified agricultural computing academy. While it contains strong foundations (gamification mathematics, normalized course schemas, and in-browser R/Python IDE structures), it suffers from severe misalignment with the competition requirements:
- **Identity Misalignment:** Framed as a generic SaaS learning portal rather than a specialized Academic Operating System tailored for the 6 faculties and 44+ departments of Bangladesh Agricultural University (BAU), Mymensingh.
- **AI Under-Utilization:** Google Gemini is currently relegated to a basic assistant wrapper (`actions/assistant.ts`) and is not integrated into core reasoning, multimodal PDF routine ingestion, visual field analysis, or adaptive prerequisite discovery.
- **Missing Audio/Voice Layer:** ElevenLabs is not yet integrated for live spoken AI viva voce examination.
- **Bloat & Theatrical Features:** Generic checkout/payment flows (bKash/Nagad mock theater), fake camera proctoring, unused Heavyweight TensorFlow dependencies, and un-gated mock states.
- **Performance Drag:** Heavy client components (`"use client"` on over 55% of UI files), un-lazyloaded Monaco editor, large client bundles, and excessive CSS overrides.

---

## 2. Current Product Purpose vs. Target Product Purpose

| Dimension | Current INSYT Academy | Target INSYT BAU |
|---|---|---|
| **Core Entity** | Generic online student / cadet | BAU Undergraduate / Postgraduate Student (Level 1–4, Semesters 1–2, MS/PhD) across 6 Faculties |
| **Primary Workflow** | Enrolling in self-paced generic courses | Managing daily routine, exam preparation (10/20/70 Ordinance), live AI oral vivas, multimodal lab/field analysis, and research thesis mapping |
| **Intelligence Engine** | Shallow chat completion wrapper | Multimodal Gemini 1.5/2.0 Flash (PDF routines, field specimen images, syllabus grounding) + ElevenLabs spoken viva voce examiner |
| **Academic Hierarchy** | Standalone course cards | University $\rightarrow$ Faculty $\rightarrow$ Department $\rightarrow$ Degree $\rightarrow$ Level/Semester $\rightarrow$ Course Code (e.g. AAS 2107, AE 2111, AGRON 1101) $\rightarrow$ Modules $\rightarrow$ Practical/Viva |
| **Evaluation Model** | Generic MCQs & pass/fail | BAU Academic Ordinance (Continuous Assessment 20% + Attendance 10% + Final Exam 70%, Grade Point & CGPA Projection) |

---

## 3. Existing Valuable Features (To Retain & Enhance)
1. **Gamification & Streak Mechanics (`lib/gamification`):** Atomic XP calculation, non-linear level curves, daily streak tracking, and streak freeze protections. Rebrand to Academic XP (Course, Viva, Lab, Research).
2. **Normalized Course & Lesson Models (`types/course.ts`, DB schema):** Structural hierarchy of courses, modules, lessons, and quizzes.
3. **Interactive Visual Nodes (`components/academy/skill-tree.tsx`):** Canvas/SVG node system with zoom/pan and branch connections. Ready to be repurposed as the **BAU Academic Prerequisite & Skill Graph**.
4. **Research Feed Foundation (`app/(dashboard)/research`):** Paper indexing and literature cards. Ready to be upgraded into the **BAU Research OS** with real BAU faculty publications and thesis gap explorer.
5. **Dark Obsidian / Scientific Lab Aesthetic (`globals.css`, `tailwind.config.ts`):** High-tech command console visual theme (Geist Sans, Geist Mono, bioluminescent emerald/neon accents).

---

## 4. Existing Weak & Problematic Features
1. **Unintegrated AI Tutor:** Uses open-domain prompting without syllabus grounding, citation provenance, or prerequisite diagnostics.
2. **Dashboard Clutter:** Focuses on generic course progress rather than "Today's Schedule", "Upcoming Viva / Class Test", "Remedial Sprint", and "CGPA Risk".
3. **Mock Payment Subsystem (`lib/payments`, `app/api/payment`):** Distracts from the academic OS core value proposition.
4. **Fake Camera Proctoring:** Placeholder code in arena that advertises phone detection without functioning models.
5. **Non-Responsive Desktop-Heavy Views:** Complex tables and fixed-width containers that fail on mobile devices.

---

## 5. Dead / Obsolete Features (Deletion / Deep Hiding Candidates)
1. `components/course/checkout-modal.tsx` & `lib/payments/*` — Remove commercial paywalls; replace with instant BAU course registration & level-semester enrollment.
2. `@tensorflow/tfjs` and `@tensorflow-models/face-detection` — Unused heavy dependencies; remove from `package.json` to eliminate bundle bloat.
3. `components/arena/camera-monitor.tsx` — Eliminate fake proctoring.
4. Generic marketing fluff on landing page — Replace with BAU Hero, live PDF routine dropzone, course explorer, and interactive viva demo.

---

## 6. Performance Bottlenecks & Optimization Plan
1. **RSC Conversion:** Convert non-interactive layout, card, and text wrappers into React Server Components (RSC).
2. **Dynamic Imports (`next/dynamic`):**
   - ElevenLabs Audio/Speech synthesis components $\rightarrow$ Lazy load on Viva page entry.
   - Monaco Editor & WASM execution runner $\rightarrow$ Lazy load only on Code Lab trigger.
   - Canvas/SVG Skill Graph $\rightarrow$ Lazy load with skeleton fallbacks.
   - WebCam & File Upload dropzones $\rightarrow$ Lazy load on Field AI tab.
3. **Bundle Pruning:** Drop dead ML packages, reduce font and CSS override overhead.

---

## 7. AI Capabilities Already Present vs. Required

| Capability | Current State | Required Target State |
|---|---|---|
| **Gemini Integration** | Basic prompt in `actions/assistant.ts` | **Central Intelligence Engine:** Multimodal PDF Routine Parser, Syllabus Grounded RAG Tutor, Field/Specimen Multimodal Vision Analyzer, Adaptive Prerequisite Diagnosis, Viva Reasoning |
| **Voice / ElevenLabs** | None | **Live Spoken AI Viva Room:** ElevenLabs voice streaming for examiners, real-time verbal assessment, dynamic rubric scoring |
| **Document Intelligence** | None | **BAU Notice & Routine Scanner:** Upload class routine / exam notice PDF $\rightarrow$ Instant calendar extraction with conflict & group filtering |
| **Multimodal Vision** | None | **Field AI / Specimen Inspector:** Upload crop pest, soil texture, plant pathology, or anatomical specimen $\rightarrow$ Educational diagnostic report with syllabus linkage |
| **Assessment Intelligence**| Simple score calculation | **BAU Ordinance Engine:** 10/20/70 continuous assessment, projected GPA/CGPA target modeling, remedial sprint generator |

---

## 8. Target BAU Information Architecture
```
INSYT BAU (Academic OS)
├── / (Landing Page — BAU Value Proposition, Interactive Demo Hooks)
├── /onboarding (BAU Profile Setup: Faculty, Department, Degree, Level, Semester)
├── /academy (BAU Academic Command Center — Today's Schedule, Remedial Sprint, AI Viva Access, CGPA HUD)
├── /academy/courses (BAU Course Catalog by Faculty & Level)
├── /academy/courses/[code] (Course Workspace — Syllabus, Gemini Tutor, Modules, Quizzes)
├── /academy/schedule (BAU Schedule Intelligence — PDF Routine Parser, Calendar, Notice Board)
├── /academy/viva (Live ElevenLabs Spoken AI Viva Room)
├── /academy/field-lab (Gemini Multimodal Field & Specimen Analysis)
├── /academy/assessment (BAU 10/20/70 Exam Lab & CGPA Simulator)
├── /academy/skills (BAU Prerequisite & Academic Dependency Graph)
├── /research (BAU Research OS — Faculty Papers, Thesis Literature Matrix, Gap Discovery)
├── /opportunities (BAU Career Bridge — BCS Agriculture, Scientific Officer, Lab Assistantships)
└── /academy/simulator (Isolated In-Browser Code Lab for Agricultural Statistics & GIS)
```

---

## 9. Next Steps
Proceed immediately to the **Master Implementation Plan** for systematic transformation across Phases 1 through 28.
