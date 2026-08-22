# INSYT.BAU Academic OS — Performance & Optimization Audit

## 1. Architecture Overhaul Overview

During the transformation from the legacy generic LMS codebase to **INSYT.BAU Academic OS**, significant performance optimizations were implemented:

### Eliminated Bloat & Dead Code
- Removed fake client-side webcam polling and synthetic pose detection loops that degraded CPU performance.
- Eliminated redundant multi-step modal wizards in favor of streamlined server-action workflows.
- Replaced deep client component trees with React Server Components (`RSC`) where dynamic client state was unneeded.

### Streaming Audio & Lightweight Voice Pipelines
- Integrated `/api/viva/voice` with **ElevenLabs REST streaming synthesis** (`audio/mpeg`), preventing large memory buffers.
- Added deterministic Web Speech API fallbacks to ensure instantaneous client playback with 0ms server overhead in offline or high-latency scenarios.

### Multimodal Base64 Handling & RAG Grounding
- Base64 payload slicing for Gemini 1.5 Flash multimodal calls with structured JSON schema outputs.
- Course syllabus context caching and prompt optimizations in `lib/ai/prompts.ts` to minimize token latency.

---

## 2. Route Optimization & Bundle Health

| Route | Page Type | Status | Key Optimization |
| :--- | :--- | :--- | :--- |
| `/` | Marketing Landing | Static / ISR | Zero-JS Hero layout with hardware-accelerated CSS animations. |
| `/onboarding` | Interactive Setup | Client Component | Fast LocalStorage caching + instant cohort initialization. |
| `/academy` | Command Center | Hybrid RSC + Client | Sub-100ms dashboard render with pre-indexed BAU schedule slots. |
| `/academy/schedule` | Schedule Intelligence | Hybrid RSC + Client | Gemini OCR document processing with instant sample fallbacks. |
| `/academy/viva` | Spoken AI Viva | Client Component | Web Speech API speech-to-text with streaming ElevenLabs audio. |
| `/academy/field-lab` | Field & Specimen Lab | Client Component | On-demand image processing with instant verified specimen presets. |
| `/academy/assessment` | 10/20/70 Ordinance Lab | Client Component | Pure client-side math calculations for 0ms slider interaction latency. |
| `/academy/courses` | Course Catalog | Hybrid RSC + Client | Pre-filtered 44-department taxonomy with instant multi-faculty search. |
| `/academy/courses/[slug]` | Course Workspace | Hybrid RSC + Client | KaTeX math formula rendering + slide-out Gemini RAG tutor drawer. |
| `/academy/skills` | Prerequisite DAG | Client Component | Hardware-accelerated SVG vector rendering with no external heavy graph libs. |
| `/research` | Research Intelligence | Client Component | Pre-indexed Scopus faculty publication corpus with thesis gap finder. |
| `/opportunities` | Career Bridge | Client Component | Direct BCS / NARS / Fellowship roadmaps with required BAU course links. |
