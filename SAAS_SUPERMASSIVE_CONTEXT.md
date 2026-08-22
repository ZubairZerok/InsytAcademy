# INSYT ACADEMY — SUPERMASSIVE SAAS CONTEXT SPECIFICATION

> **Document Version:** 2.0.0  
> **Classification:** Full System Architecture, Database Schema, Security Policy, Component Hierarchy & Operational Manual  
> **Target Audience:** Core Engineering, Product Architects, Security Auditors, and AI Agents  
> **Last Updated:** August 2026  

---

## TABLE OF CONTENTS
1. [Executive Summary & SaaS Product Definition](#1-executive-summary--saas-product-definition)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Technology Stack & Dependency Inventory](#3-technology-stack--dependency-inventory)
4. [Complete Directory & File Structure](#4-complete-directory--file-structure)
5. [Database Architecture, ERD & Data Models](#5-database-architecture-erd--data-models)
6. [Gamification Engine & Progression Mathematics](#6-gamification-engine--progression-mathematics)
7. [Authentication, Authorization & Security Architecture](#7-authentication-authorization--security-architecture)
8. [Module & Feature Subsystem Deep-Dives](#8-module--feature-subsystem-deep-dives)
   - 8.1. Academy & Adaptive Curriculum Architecture (ACA)
   - 8.2. Problem Arena & Competitive Coding Sandbox
   - 8.3. Research Hub & Academic Preprint System
   - 8.4. Opportunities & Career Placement Hub
   - 8.5. In-Browser Simulation, IDE & AI Copilot
   - 8.6. Verifiable Credentials & Digital Certificates
   - 8.7. Administrative Console & Submission Grading Queue
   - 8.8. Localized Monetization & Payment Infrastructure
9. [Server Actions & API Reference Directory](#9-server-actions--api-reference-directory)
10. [Design System, Aesthetics & UI/UX Design Tokens](#10-design-system-aesthetics--uiux-design-tokens)
11. [Configuration, Feature Flags & Deployment Playbook](#11-configuration-feature-flags--deployment-playbook)

---

## 1. EXECUTIVE SUMMARY & SAAS PRODUCT DEFINITION

### 1.1. Core Mission & Problem Statement
**INSYT Academy** (formerly *PlAiNSYT*) is a next-generation, high-performance, gamified edtech platform and competitive computing laboratory. It is specifically engineered to bridge the digital and computational skills gap in the Global South (headquartered for Bangladesh), with focus on:
- **Bioinformatics & Computational Genomics** (e.g., RNA-seq pipelines, CRISPR target analysis, FASTA alignment).
- **Precision Agriculture & Agronomy Data Science** (e.g., soil salinity modeling, crop yield forecasting, NPK dosage optimization).
- **Geographic Information Systems (GIS) & Remote Sensing** (e.g., Google Earth Engine, Sentinel-2 multispectral vegetation indices, mangrove canopy classification).
- **Forestry, Aquaculture & Climate Analytics** (e.g., IoT shrimp pond water quality forecasting, drone multispectral imagery).

Traditional LMS platforms (Coursera, Udemy, edX) fail learners in these specialized domains because they lack:
1. Native, in-browser scientific computing runtimes (R/Python) that do not require complex local CUDA/Conda installations.
2. Domain-adaptive curricula tailored to diverse agricultural and life-science subsectors.
3. Culturally and economically aligned payment channels (bKash/Nagad tokenized payments).
4. Direct pathways from problem-solving to paid research assistantships and industrial grants.

### 1.2. Value Propositions
- **Adaptive Curriculum Architecture (ACA):** A single lesson dynamically morphs its explanatory text, code samples, and business scenarios according to the learner's chosen sector (e.g., Agriculture vs. Biotechnology vs. Forestry vs. General Data Science).
- **Zero-Install Interactive Coding:** Pyodide (Python WASM) and WebR (R WASM) run directly inside the user's browser, augmented by a sandboxed iframe executor and an AI-powered Lab Copilot.
- **Idempotent Gamification:** Duolingo-style XP loops, streak preservation, dynamic level tiers (Seedling to Legend), and automated badge triggers built on top of atomic PostgreSQL stored procedures.
- **Competitive Problem Arena:** Daily coding challenges with server-enforced attempt limits, hint penalization, automated answer verification, and manual instructor review queues.
- **Direct Career & Research Integration:** Peer-reviewed preprint hub and level-gated opportunity applications for RA positions, university lab attachments, and corporate data gigs.

---

## 2. HIGH-LEVEL SYSTEM ARCHITECTURE

```
                                    +------------------------------------------+
                                    |               End-User Client            |
                                    |    (Next.js 14 App Router / React 18)    |
                                    +---------------------+--------------------+
                                                          |
                                           HTTPS / Edge Middleware (Auth Refresh)
                                                          |
                               +--------------------------v---------------------------+
                               |                   Next.js Server Layer               |
                               |   - Server Actions (Mutations & Privileged Reads)    |
                               |   - API Route Handlers (/api/payment/*)              |
                               |   - Sandboxed LLM & Payment Gateways                 |
                               +------------+--------------------+--------------------+
                                            |                    |
                         Internal Postgres  |                    | Third-Party Services
                                            |                    |
             +------------------------------v---+   +------------v--------------------+
             |        Supabase Platform         |   |      External Cloud Services    |
             |  - PostgreSQL 15 Database        |   |  - DeepSeek LLM (Live / Mock)   |
             |  - Supabase Auth (SSR Cookies)   |   |  - bKash Tokenized Checkout     |
             |  - Row Level Security (RLS)      |   |  - CDN Static Assets (WASM)     |
             |  - Atomic Pl/pgSQL Functions     |   +---------------------------------+
             +----------------------------------+
```

### Architectural Key Pillars
1. **SSR + Edge Route Protection:** `middleware.ts` runs on Edge Runtime, refreshing Supabase session cookies on every request and enforcing baseline route access.
2. **Server Action Authorization Boundary:** All business mutations are executed via Next.js Server Actions (`"use server"`). Privilege verification is centralized in `lib/auth/assert-role.ts`.
3. **Database-Driven Integrity:** Gamification math, XP idempotency, streak calculations, and level increments are handled inside PostgreSQL `SECURITY DEFINER` stored procedures to eliminate race conditions and client-side tampering.
4. **Resilient Gateway Abstraction:** Both LLM and Payment subsystems employ dynamic provider gateways (`lib/llm/llm-gateway.ts`, `lib/payments/payment-gateway.ts`) that automatically switch between live production APIs and zero-crash mock engines based on environment variables.

---

## 3. TECHNOLOGY STACK & DEPENDENCY INVENTORY

### 3.1. Core Framework & Language
- **Next.js (`14.2.16`):** React Server Components (RSC), App Router, dynamic server routes, server actions, metadata API.
- **React (`^18.0.0`):** Core UI engine, React Hooks, Concurrent Mode.
- **TypeScript (`^5.0.0`):** Strict type safety across all database interfaces, gamification entities, and server responses.
- **Node.js (`>=20.0.0`):** Server runtime environment.

### 3.2. Styling & Design System
- **Tailwind CSS (`^3.4.1`):** Utility-first responsive design, custom bio-luminescent cyber-agro theme tokens.
- **Framer Motion (`^12.24.12`):** Hardware-accelerated transitions, interactive modals, XP gain indicators.
- **Geist (`^1.7.1`):** High-legibility typography system from Vercel.
- **Lucide React (`^0.562.0`):** Modular icon system for dashboard navigation and status tags.
- **KaTeX (`^0.17.0`) & `rehype-katex` (`^7.0.1`) / `remark-math` (`^6.0.0`):** Server and client rendering of mathematical equations and scientific notation.
- **`clsx` & `tailwind-merge`:** Conditional class name generation without style conflicts.

### 3.3. Database & Authentication
- **`@supabase/ssr` (`^0.8.0`):** Secure server-side cookie-based auth session management for Next.js App Router.
- **`@supabase/supabase-js` (`^2.90.1`):** Official Supabase client for database operations, authentication, and RPC invocation.

### 3.4. Interactive Runtimes & Utilities
- **Monaco Editor (`@monaco-editor/react` `^4.7.0`):** High-performance VS Code editor component for browser-based coding challenges.
- **Radix UI Primitives:** Accessible unstyled primitives (`@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-popover`).
- **`xlsx` (`^0.18.5`):** Spreadsheet and dataset manipulation for agricultural research outputs.
- **WASM Runtimes:** Pyodide (client-side Python) and WebR (client-side R) loaded on-demand for zero-latency local code execution.

---

## 4. COMPLETE DIRECTORY & FILE STRUCTURE

```
d:/Insyt All Web V/insyt academy
├── actions/                         # Next.js Server Actions (Database mutations & privileged queries)
│   ├── activity.ts                  # User activity logging (upvotes, comments, shares)
│   ├── admin-problems.ts            # Admin problem authoring, publishing & management
│   ├── assistant.ts                 # AI Lab Copilot prompt processor with rate limiting
│   ├── auth.ts                      # Sign in, Sign up (with Sector metadata), Sign out, Password reset
│   ├── badges.ts                    # Badge catalog query and unlock triggers
│   ├── certificates.ts              # Course completion verification and certificate issuing
│   ├── enrollment.ts                # Course enrollment management
│   ├── gamification.ts              # Core XP award, streak update, and leaderboard engine
│   ├── get-course-content.ts        # Course syllabus and hierarchy loader
│   ├── get-courses.ts               # Course catalog fetcher
│   ├── get-lesson.ts                # Individual lesson loader with next/prev traversal
│   ├── get-user-courses.ts          # Enrolled courses with real-time percentage progress
│   ├── ide.ts                       # IDE code execution simulation and fallback handler
│   ├── instructor.ts                # Instructor course CRUD and student monitoring
│   ├── notifications.ts             # Notification polling, mark-as-read, system auto-sync
│   ├── opportunities.ts             # Opportunity search, level check, and application submission
│   ├── problems.ts                  # Student problem arena fetcher, code submission & attempt tracking
│   ├── progress.ts                  # Lesson completion, idempotency check, XP trigger
│   ├── quiz.ts                      # Server-side quiz attempt evaluation and scoring
│   ├── recommendations.ts           # Sector-aware course recommendation engine
│   ├── research-actions.ts          # Research paper upvoting, bookmarking, and user interaction
│   ├── research-articles.ts         # Static and dynamic research article catalog
│   ├── research.ts                  # Research database query engine with fallback seeds
│   ├── resume.ts                    # Quick-resume pointer to find next uncompleted lesson
│   ├── search.ts                    # Global platform search indexer
│   ├── settings.ts                  # User profile and notification preferences update
│   ├── simulator.ts                 # Terminal command processor and pseudo-R interpreter
│   └── translate.ts                 # R <-> Python automated code translator
│
├── app/                             # Next.js App Router (Routing, Layouts, Pages)
│   ├── (auth)/                      # Public Authentication Route Group
│   │   ├── forgot-password/page.tsx # Password recovery request page
│   │   ├── login/page.tsx           # Email/password authentication page
│   │   ├── signup/page.tsx          # Account creation with Sector Selection modal
│   │   └── update-password/page.tsx # Authenticated password update form
│   ├── (dashboard)/                 # Protected Platform Route Group
│   │   ├── academy/                 # Main Learning Management System
│   │   │   ├── [slug]/              # Course Detail & Lesson Player
│   │   │   │   ├── [lessonSlug]/    # Interactive Lesson Page (Content, Code, Quiz, Copilot)
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx       # Course sidebar layout
│   │   │   │   └── page.tsx         # Course overview & syllabus page
│   │   │   ├── arena/page.tsx       # Problem Arena (Competitive Coding & Challenge Browser)
│   │   │   ├── certificates/page.tsx# Digital Certificate Wall & Verifier
│   │   │   ├── courses/page.tsx     # Full Course Catalog with category filters
│   │   │   ├── profile/             # Profile & Performance Analytics
│   │   │   │   ├── [id]/page.tsx    # Public Profile View
│   │   │   │   ├── loading.tsx      # Skeleton loader
│   │   │   │   └── page.tsx         # Authenticated User Profile & Heatmap
│   │   │   ├── settings/page.tsx    # Profile, Security & Notification Preferences
│   │   │   ├── simulator/page.tsx   # Standalone Cyber-Lab & Interactive Shell
│   │   │   ├── loading.tsx          # Dashboard loading skeleton
│   │   │   └── page.tsx             # Main User Dashboard (Enrolled courses, stats, HUD)
│   │   ├── admin/                   # Administrative Management Console
│   │   │   ├── problems/page.tsx    # Problem creation, test-case config & publishing
│   │   │   ├── submissions/page.tsx # Student arena submission review & manual grading queue
│   │   │   └── page.tsx             # System Health & Admin Stats Overview
│   │   ├── leaderboard/page.tsx     # Global XP Leaderboard with Podiums & Staff Badges
│   │   ├── opportunities/page.tsx   # Job Board, Internships & Research Grant Postings
│   │   ├── research/                # Agricultural & Life-Sciences Preprint Hub
│   │   │   ├── [id]/page.tsx        # Research Paper Detail, Dataset Download, Discussion
│   │   │   ├── layout.tsx           # Research sub-navigation layout
│   │   │   └── page.tsx             # Research paper feed with discipline filters
│   │   └── layout.tsx               # Master Authenticated Shell (Sidebar, Topbar, Streak updater)
│   ├── (marketing)/                 # Public Marketing Route Group
│   │   ├── contact/page.tsx         # Contact & Support Desk
│   │   ├── privacy/page.tsx         # Privacy Policy
│   │   ├── refund/page.tsx          # Refund & Cancellation Terms
│   │   ├── terms/page.tsx           # Platform Terms of Service
│   │   ├── layout.tsx               # Marketing header & footer layout
│   │   └── page.tsx                 # Hero Landing Page, Feature Bento & Testimonials
│   ├── api/                         # HTTP API Route Handlers
│   │   └── payment/
│   │       ├── callback/route.ts    # bKash Payment Execution & Verification Callback
│   │       └── initialize/route.ts  # Payment initialization & invoice generator
│   ├── auth/callback/route.ts       # Supabase OAuth and Magic Link Auth Callback Handler
│   ├── error.tsx                    # Route-level error boundary
│   ├── global-error.tsx             # Root error boundary
│   ├── globals.css                  # Global Tailwind imports & CSS custom properties
│   ├── layout.tsx                   # HTML Root Layout (Fonts, Theme Provider)
│   └── not-found.tsx                # Custom 404 Cyber-Lab Terminal Screen
│
├── components/                      # Reusable UI & Business Components
│   ├── academy/                     # LMS Components (Hero, LessonContent, VideoPlayer, SkillTree, etc.)
│   ├── arena/                       # Arena Components (SolverModal, Monaco Wrapper, SubmissionFeed)
│   ├── auth/                        # Auth Components (AuthForm, SectorSelection, PasswordResetForms)
│   ├── course/                      # Course Components (CheckoutModal, PricingCard)
│   ├── gamification/                # Gamification HUD (LeaderboardWidget, XPProgressBar, StreakHUD, Badges)
│   ├── instructor/                  # Instructor Components (CourseForm, StudentTable)
│   ├── layout/                      # Layout Shells (DashboardSidebar, DashboardTopbar, SiteHeader, SiteFooter)
│   ├── opportunities/               # Opportunity Components (OpportunityModal, ApplicationForm)
│   ├── providers/                   # Context Providers (ThemeProvider)
│   ├── research/                    # Research Components (PaperCard, ArticleActions, CitationGenerator)
│   ├── simulator/                   # Simulator Components (AssistantPanel, IDE, Terminal, Console)
│   └── ui/                          # Radix/Tailwind Atomic UI (Button, Dialog, Input, BentoGrid, GlassCard)
│
├── lib/                             # Core Infrastructure, Utilities & SDK Wrappers
│   ├── auth/assert-role.ts          # Server-side RBAC guards (assertAdmin, assertInstructor, requireRole)
│   ├── execution/sandbox-runner.ts  # Sandboxed iframe JavaScript execution runtime
│   ├── execution/use-execution...   # React hook controller for multi-language execution
│   ├── gamification/constants.ts    # Single source of truth for XP economics & level formulas
│   ├── gamification/levels.ts       # Pure functions for XP progress calculation & tier mapping
│   ├── llm/                         # DeepSeek V3/R1 & Mock LLM Gateway
│   ├── payments/                    # bKash Tokenized Checkout & Mock Payment Gateway
│   ├── supabase/admin.ts            # Supabase Service Role client (bypasses RLS for system operations)
│   ├── supabase/client.ts           # Supabase Browser client (for client-side subscriptions)
│   ├── supabase/server.ts           # Supabase SSR server client (respects cookies & RLS)
│   ├── feature-flags.ts             # Feature flag evaluator
│   ├── notifications.ts             # Server-only notification dispatcher
│   ├── queue.ts                     # Analytics event logger & telemetry pipeline
│   ├── rate-limit.ts                # Token-bucket in-memory rate limiter
│   └── utils.ts                     # Tailwind class merge helper
│
├── supabase/                        # Database Migrations, SQL Schemas & Seed Scripts
│   ├── MIGRATIONS.md                # Definitive execution order documentation
│   ├── schema.sql                   # Baseline database tables (Courses, Modules, Lessons, Progress)
│   ├── migration_phase1.sql         # Payment transactions & pricing schema
│   ├── migration_phase2.sql         # Research preprints & B2B opportunities schema
│   ├── migration_phase3_security.sql# RBAC role normalization, admin seed & RLS hardening
│   ├── migration_phase4_community.sql# Upvoting RPC and deduplication schema
│   ├── migration_phase5_perf.sql    # Set-based level recalculation optimization
│   ├── migration_phase6_analytics.sql# Analytics events telemetry table
│   ├── migration_phase7_storage.sql # Storage bucket policies for avatars and datasets
│   ├── supabase_gamification_complete.sql # Complete XP audit log, quiz engine, and level procedures
│   ├── supabase_arena_patch.sql     # Problem arena attempt limits and submission tables
│   ├── supabase_badges_and_streaks.sql # Streak tracking and automated badge unlock RPC
│   ├── gamification_repair.sql      # Single-run all-in-one schema repair script
│   └── seeds/                       # Domain-specific comprehensive course seeds
│       ├── gee_course_seeds.sql     # Google Earth Engine for Environmental Analysis
│       ├── gis_course_seeds.sql     # QGIS & Spatial Data Science for Agronomists
│       └── r_course_seeds.sql       # R for Biological Data Science (Complete 4-Module Curriculum)
│
├── types/                           # TypeScript Interface Declarations
│   ├── course.ts                    # Course, Module, Lesson, Enrollment, Progress types
│   ├── gamification.ts              # XP, Badges, Streaks, Levels, Arena, Quizzes, Leaderboard types
│   └── opportunity.ts               # Job postings, Internships, Applications types
│
├── middleware.ts                    # Next.js Edge Middleware for Auth Refresh & Route Protection
├── next.config.mjs                  # Next.js compiler config & security headers
├── package.json                     # Dependency manifests & execution scripts
├── tailwind.config.ts               # Theme extensions, animations, custom color tokens
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## 5. DATABASE ARCHITECTURE, ERD & DATA MODELS

### 5.1. Entity Relationship Diagram (ERD)

```
 [auth.users] (Supabase Auth)
       |
       +---> [profiles] (1:1)
       |        |
       |        +---> [enrollments] (N:M with courses)
       |        +---> [user_progress] (N:M with lessons)
       |        +---> [xp_events] (Immutable XP Audit Log)
       |        +---> [quiz_submissions] (Quiz attempts)
       |        +---> [problem_attempts] (Arena code submissions)
       |        +---> [user_badges] (Unlocked achievements)
       |        +---> [streak_logs] (Daily activity trail)
       |        +---> [certificates] (Course completion credentials)
       |        +---> [opportunity_applications] (Job/Grant applications)
       |        +---> [transactions] (bKash Payment Records)
       |
 [courses] (Catalog)
       |
       +---> [course_pricing] (1:1 Pricing model)
       +---> [modules] (1:N Hierarchy)
                |
                +---> [lessons] (1:N Hierarchy)
                         |
                         +---> [quizzes] (1:1 or 1:N Assessment)
                                  |
                                  +---> [quiz_questions] (1:N Questions)
```

### 5.2. Core Database Schema Tables & Columns

#### 1. `public.profiles`
Primary user profile table, automatically populated via `handle_new_user()` trigger on `auth.users` insert.
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'student', -- 'student' | 'instructor' | 'admin'
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_count INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  streak_claimed_at TIMESTAMPTZ,
  sector TEXT DEFAULT 'GEN',           -- 'AGRI' | 'BIOTECH' | 'GIS' | 'FORESTRY' | 'GEN'
  sub_sector TEXT,
  settings JSONB DEFAULT '{"notifications": true, "haptics": false, "publicProfile": true, "dataSharing": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `public.courses`
Course catalog definition.
```sql
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### 3. `public.modules`
Organizational chapters within courses.
```sql
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(course_id, slug)
);
```

#### 4. `public.lessons`
Individual pedagogical units with Adaptive Curriculum Architecture support.
```sql
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,                   -- Default Markdown content
  content_variants JSONB,         -- Sector overrides: { "AGRI": "...", "BIOTECH": "...", "GIS": "..." }
  video_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(module_id, slug)
);
```

#### 5. `public.xp_events` (The Idempotency Ledger)
Audit trail of every XP transaction. Ensures a user can never be awarded double XP for the same action.
```sql
CREATE TABLE public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,       -- 'lesson_complete' | 'daily_login' | 'streak_bonus' | 'quiz_pass' | 'problem_solve'
  source_id TEXT,                 -- e.g. lesson UUID, problem UUID, or 'login_2026-08-17'
  xp_awarded INTEGER NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT xp_events_dedup UNIQUE (user_id, event_type, source_id)
);
```

#### 6. `public.problems` & `public.problem_attempts`
The Competitive Problem Arena tables.
```sql
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1, -- 1: Easy, 2: Medium, 3: Hard
  tags TEXT[] NOT NULL DEFAULT '{}',
  hints TEXT[] NOT NULL DEFAULT '{}',
  expected_answer TEXT,                  -- Hidden from client; used for auto-grading
  answer_type TEXT DEFAULT 'exact',      -- 'exact' | 'numeric_tolerance' | 'regex'
  answer_tolerance NUMERIC DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 150,
  time_limit_seconds INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.problem_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  code_submission TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  xp_earned INTEGER NOT NULL DEFAULT 0,
  time_taken_seconds INTEGER,
  admin_feedback TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### 7. `public.badges` & `public.user_badges`
Achievement unlock system.
```sql
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'learning', -- 'learning' | 'streak' | 'arena' | 'xp' | 'special'
  icon TEXT NOT NULL DEFAULT 'Award',
  rarity TEXT NOT NULL DEFAULT 'common',     -- 'common' | 'rare' | 'epic' | 'legendary'
  xp_bonus INTEGER NOT NULL DEFAULT 50,
  secret BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta JSONB DEFAULT '{}',
  CONSTRAINT user_badge_unique UNIQUE (user_id, badge_id)
);
```

#### 8. `public.transactions` & `public.course_pricing`
Localized monetization ledger.
```sql
CREATE TABLE public.course_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE UNIQUE,
  price_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  is_free BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  trx_id TEXT NOT NULL UNIQUE,
  payment_gateway TEXT NOT NULL DEFAULT 'bkash', -- 'bkash' | 'nagad' | 'mock'
  amount_bdt NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',        -- 'PENDING' | 'SUCCESS' | 'FAILED'
  gateway_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.3. Key PostgreSQL Stored Procedures & Atomic Functions

#### `public.award_xp(p_user_id, p_event, p_source_id, p_xp, p_meta)`
Atomically inserts into `xp_events` and calculates level up, updating `profiles.total_xp` and `profiles.level`. Returns JSON `{ success, new_total_xp, new_level, leveled_up, xp_awarded }`.

#### `public.update_streak(p_user_id)`
Calculates daily activity. If `last_active_date == today`, returns `already_updated`. If `last_active_date == yesterday`, increments `streak_count`. If gap > 1 day, resets `streak_count = 1`. Updates `longest_streak` if exceeded.

#### `public.check_and_award_badges(p_user_id)`
Evaluates all achievement conditions (e.g. 1st lesson completed, 7-day streak, 1000 XP reached, Arena master) and awards eligible badges, calling `award_xp` for badge bonus rewards.

---

## 6. GAMIFICATION ENGINE & PROGRESSION MATHEMATICS

### 6.1. Level Calculation Formula
INSYT Academy uses a square-root progression curve. Early levels are acquired rapidly to build initial momentum, while mastery levels require sustained commitment.

$$\text{Level} = \min\left( \left\lfloor \sqrt{\frac{\text{Total XP}}{100}} \right\rfloor + 1, \; 50 \right)$$

$$\text{XP Required for Level } L = (L - 1)^2 \times 100$$

### 6.2. Level Milestones & Progression Table

| Level | Total XP Required | Delta from Previous | Level Tier | Tier Title | Badge Emoji | Design Token Gradient |
|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **1** | 0 XP | — | Tier 1 | Seedling | 🌱 | `from-agri-deep to-cyber-gray` |
| **2** | 100 XP | +100 XP | Tier 1 | Seedling | 🌱 | `from-agri-deep to-cyber-gray` |
| **3** | 400 XP | +300 XP | Tier 1 | Seedling | 🌱 | `from-agri-deep to-cyber-gray` |
| **4** | 900 XP | +500 XP | Tier 1 | Seedling | 🌱 | `from-agri-deep to-cyber-gray` |
| **5** | 1,600 XP | +700 XP | Tier 2 | Sprout | 🌿 | `from-neon-green-muted to-neon-green-dim` |
| **10** | 8,100 XP | +1,700 XP | Tier 3 | Cultivator | 🌾 | `from-neon-green-dim to-neon-green` |
| **15** | 19,600 XP | +2,700 XP | Tier 4 | Harvester | ⚡ | `from-info-cyan to-neon-green` |
| **20** | 36,100 XP | +3,700 XP | Tier 5 | Agrologist | 🔬 | `from-alert-amber to-info-cyan` |
| **30** | 84,100 XP | +5,700 XP | Tier 6 | Specialist | 🏆 | `from-alert-amber to-neon-green` |
| **40** | 152,100 XP | +7,700 XP | Tier 7 | Maestro | 🔥 | `from-bkash-pink to-alert-amber` |
| **50** | 240,100 XP | +9,700 XP | Tier 8 | Legend | ⭐ | `from-bkash-pink to-neon-green` |

### 6.3. XP Economy & Reward Schedules
- **Lesson Completion:** `+50 XP` (idempotent per lesson UUID).
- **Daily Login Streak:** `+5 XP` (first authenticated request of the UTC day).
- **7-Day Streak Milestone:** `+100 XP` (awarded at days 7, 14, 21, 28...).
- **30-Day Streak Milestone:** `+500 XP`.
- **Quiz Score (70% - 100%):** Scaled linearly:
  $$\text{Quiz XP} = \text{round}\left( 25 + \frac{\text{Score} - 70}{30} \times (75 - 25) \right)$$
- **Problem Arena Solve:** `+100 XP` to `+500 XP` (Default: `+150 XP`).
- **Instructor Approved Project:** `+500 XP`.
- **Peer-Reviewed Project:** `+300 XP`.

---

## 7. AUTHENTICATION, AUTHORIZATION & SECURITY ARCHITECTURE

### 7.1. Edge Middleware (`middleware.ts`)
The Edge Middleware operates before any route handler or page renderer is invoked:
1. **Cookie Session Refresh:** Updates expiring Supabase JWTs via `@supabase/ssr`.
2. **Unauthenticated Redirects:** Non-logged-in users accessing `/academy/*`, `/instructor/*`, `/admin/*`, `/leaderboard/*`, `/research/*` are redirected to `/login?redirect=<safe_path>`. Safe relative URL validation prevents Open Redirect attacks.
3. **Role Gating:** Edge check on `/admin/*` requiring `profiles.role === 'admin'`.

### 7.2. Server-Side RBAC Guard Layer (`lib/auth/assert-role.ts`)
To prevent authorization bypasses, all Server Actions and Pages invoke authoritative server guards:
- `assertAuthenticated()`: Returns verified `User` or throws.
- `assertInstructor()`: Verifies user has role `'instructor'` or `'admin'`, else throws.
- `assertAdmin()`: Verifies user has role `'admin'`, else throws.
- `requireAuthenticated()`, `requireInstructor()`, `requireAdmin()`: Redirecting counterparts for React Server Component pages.

### 7.3. Untrusted Code Execution Sandbox (`lib/execution/sandbox-runner.ts`)
To prevent Stored-XSS and Remote Code Execution via submitted student code:
- Code is injected into an isolated `<iframe sandbox="allow-scripts">` without `allow-same-origin`.
- The iframe executes in an opaque origin: cannot access cookies, `localStorage`, session tokens, or parent DOM.
- Communication occurs exclusively via asynchronous `window.postMessage` with an enforced 10-second teardown timeout.

### 7.4. AI Security & Denial-of-Wallet Protections (`actions/assistant.ts`)
- **Mandatory Auth:** Anonymous access is blocked.
- **In-Memory Rate Limiting:** Enforces maximum 20 requests per user per 60 seconds (`lib/rate-limit.ts`).
- **Input Sanitization:** Clamps prompts to 4,000 characters, code context to 8,000 characters, and conversation history to 20 turns.
- **Prompt Injection Defense:** Student code is injected into the system prompt strictly wrapped in delimiter fences as unexecutable data, overriding any adversarial system instructions.

---

## 8. MODULE & FEATURE SUBSYSTEM DEEP-DIVES

### 8.1. Academy & Adaptive Curriculum Architecture (ACA)
- **Path:** `/academy`, `/academy/[slug]`, `/academy/[slug]/[lessonSlug]`
- **Concept:** When a student opens a lesson (e.g. *Data Wrangling with dplyr*), the system checks `profiles.sector`.
  - If `sector === 'AGRI'`, code examples use rice crop yields and soil nitrogen data.
  - If `sector === 'BIOTECH'`, code examples use FASTA gene sequencing lengths and PCR amplification values.
  - If `sector === 'GIS'`, code examples use NDVI reflectance bands and polygon coordinates.
- **Lesson Completion Flow:**
  1. Student reads Markdown/KaTeX text and interacts with code snippets.
  2. Clicking "Complete Lesson" triggers `actions/progress.ts:completeLesson()`.
  3. Inserts into `user_progress`, awards `+50 XP`, updates user level, auto-enrolls user in course if needed.
  4. Triggers revalidation of course syllabus accordion and unlocks subsequent lesson.

### 8.2. Problem Arena & Competitive Coding Sandbox
- **Path:** `/academy/arena`
- **Concept:** Daily coding problems across R, GIS, Statistics, Python, and Machine Learning.
- **Rules & Anti-Cheat:**
  - Standard users get **5 attempts per problem per UTC calendar day**.
  - Admin/Instructor roles have unlimited test attempts.
  - Test answers are evaluated server-side against `problems.expected_answer` via exact match or numerical tolerance.
  - Full code submissions are saved in `problem_attempts` for instructor manual code-quality grading.

### 8.3. Research Hub & Academic Preprint System
- **Path:** `/research`, `/research/[id]`
- **Concept:** Domain-specific preprint hub for agricultural biotechnology, mangrove remote sensing, and soil microbiome data.
- **Features:**
  - Filter by discipline (Bioinformatics, Crop Science, Forestry, Soil Science, Aquaculture).
  - Upvoting system backed by `research_votes` and atomic `add_upvote` RPC.
  - Bookmarking saved articles stored in `profiles.settings.saved_articles`.
  - Direct links to open-access PDFs and downloadable research datasets.

### 8.4. Opportunities & Career Placement Hub
- **Path:** `/opportunities`
- **Concept:** Curated job board connecting top academy learners with research institutions (BARI, BRRI, BAU) and international agritech labs.
- **Level-Gated Applications:**
  - Each posting defines `min_level_required` (e.g., Level 5 Sprout for junior internships, Level 15 Harvester for lead RA positions).
  - Users below the required level receive an automated alert detailing the exact XP needed to unlock the position.
  - Application submissions record user cover notes and portfolio links into `opportunity_applications`.

### 8.5. In-Browser Simulation, IDE & AI Copilot
- **Path:** `/academy/simulator`
- **Concept:** Dual-panel cybernetic terminal and IDE environment.
- **Features:**
  - Monaco Editor supporting R and Python syntax highlighting.
  - WebR & Pyodide execution hooks with real-time stdout and stderr output consoles.
  - INSYT AI Lab Director Copilot (`actions/assistant.ts`) providing contextual debugging suggestions without giving away direct answers.
  - Automated R <-> Python Code Translator (`actions/translate.ts`).

### 8.6. Verifiable Credentials & Digital Certificates
- **Path:** `/academy/certificates`
- **Concept:** Cryptographically verifiable digital certificates awarded upon completing 100% of a course's lessons.
- **Features:**
  - Automated completion verification across all course modules (`actions/certificates.ts`).
  - Unique certificate UUID generator with public verification URL (`/academy/certificates?id=...`).
  - High-resolution printable CSS layout with gold bio-cyber seal and verified instructor signatures.

### 8.7. Administrative Console & Submission Grading Queue
- **Path:** `/admin`, `/admin/problems`, `/admin/submissions`
- **Concept:** Staff-only mission control for platform oversight.
- **Features:**
  - Problem Creator: Author problem descriptions, tags, difficulty, test cases, and tolerance values.
  - Submission Grading Queue: Inspect student code submissions, view execution timestamps, and approve/reject submissions with custom feedback and XP awards.
  - Telemetry: Real-time user registration counts, course completion rates, and system error rates.

### 8.8. Localized Monetization & Payment Infrastructure
- **Path:** `/api/payment/initialize`, `/api/payment/callback`, `components/course/checkout-modal.tsx`
- **Concept:** Tokenized mobile financial services (bKash) integration.
- **Workflow:**
  1. Client triggers checkout for paid course (`course_pricing.is_free === false`).
  2. `initialize` route calls `BkashProvider.createPayment()`, generating a payment gateway URL.
  3. User completes PIN/OTP on official bKash tokenized portal.
  4. bKash redirects to `/api/payment/callback` with `paymentID` and `status`.
  5. Server executes `BkashProvider.executePayment()`, verifies transaction amount, updates `transactions` table to `SUCCESS`, and inserts into `enrollments`.

---

## 9. SERVER ACTIONS & API REFERENCE DIRECTORY

| Server Action / Route | Target File | Authentication | Allowed Roles | Description |
|:---|:---|:---:|:---:|:---|
| `login(formData)` | `actions/auth.ts` | Public | All | Signs in user via email/password; sets SSR cookies. |
| `signup(formData)` | `actions/auth.ts` | Public | All | Creates user with Full Name, Sector, and Sub-sector metadata. |
| `logout()` | `actions/auth.ts` | Required | All | Invalidates session and clears SSR cookies. |
| `awardLessonXP(lessonId)` | `actions/gamification.ts` | Required | All | Calls atomic `award_xp` RPC for `lesson_complete`. |
| `updateUserStreak()` | `actions/gamification.ts` | Required | All | Evaluates daily activity; updates streak and awards milestones. |
| `getLeaderboard()` | `actions/gamification.ts` | Required | All | Fetches cached top-100 leaderboard with staff badges. |
| `getPublishedProblems(tag)` | `actions/problems.ts` | Required | All | Returns problems with user's remaining daily attempts. |
| `submitProblemCode(data)` | `actions/problems.ts` | Required | All | Records arena attempt; auto-grades answer if configured. |
| `getAdminProblems()` | `actions/admin-problems.ts` | Required | Admin | Fetches all published and draft problems. |
| `createAdminProblem(data)` | `actions/admin-problems.ts` | Required | Admin | Authors and publishes new arena coding problem. |
| `reviewSubmission(data)` | `actions/admin-problems.ts` | Required | Admin | Approves/rejects student submission and triggers XP. |
| `askAssistant(prompt, ...)` | `actions/assistant.ts` | Required | All | Queries DeepSeek LLM copilot with rate limit checks. |
| `translateCode(code, target)` | `actions/translate.ts` | Required | All | Translates code between R and Python via LLM. |
| `completeLesson(lessonId, slug)` | `actions/progress.ts` | Required | All | Idempotently marks lesson complete and awards XP. |
| `submitQuizAnswer(...)` | `actions/quiz.ts` | Required | All | Evaluates quiz attempt against correct options. |
| `checkAndIssueCertificate(id)` | `actions/certificates.ts` | Required | All | Verifies 100% completion and issues certificate. |
| `getOpportunities(filter, q)` | `actions/opportunities.ts` | Required | All | Fetches job postings and user qualification state. |
| `applyForOpportunity(...)` | `actions/opportunities.ts` | Required | All | Enforces min level check and records application. |
| `voteResearchArticle(id, dir)` | `actions/research-actions.ts` | Required | All | Upvotes/downvotes research preprint via RPC. |
| `updateSettings(name, config)` | `actions/settings.ts` | Required | All | Updates user full name and notification preferences. |
| `POST /api/payment/initialize` | `app/api/payment/...` | Required | All | Generates bKash payment invoice URL. |
| `GET/POST /api/payment/callback`| `app/api/payment/...` | Public (Gateway) | bKash IPN | Verifies payment execution and grants course enrollment. |

---

## 10. DESIGN SYSTEM, AESTHETICS & UI/UX DESIGN TOKENS

### 10.1. Color Palette Tokens (`tailwind.config.ts`)

```typescript
colors: {
  // Bio-Luminescent Cyber Matrix
  "agri-dark":       "#040D08", // Base Canvas Dark
  "agri-deep":       "#07130D", // Surface Dark Level 1
  "agri-card":       "#0B1E14", // Surface Dark Level 2
  "cyber-gray":      "#1E293B", // Border & Sub-panel Gray
  
  // Neon Accents
  "neon-green":      "#00FF94", // Primary Action & Level Accent
  "neon-green-dim":  "#00CC76", // Secondary Accent
  "neon-green-muted":"#008F53", // Low-contrast Accent
  
  // Functional Status
  "alert-amber":     "#FFB800", // Warnings, Tier 5-6 Accents
  "info-cyan":       "#00E5FF", // Information, Tier 4 Accent
  "bkash-pink":      "#E2136E", // bKash Monetization & Legend Tier
}
```

### 10.2. Component Design Patterns
- **`GlassCard`:** Dark green translucent container with subtle backdrop blur and neon perimeter border:
  `bg-[#0B1E14]/70 backdrop-blur-md border border-[#00FF94]/20 rounded-xl`
- **`BentoGrid` & `BentoCard`:** Asymmetric dashboard layout blocks with micro-hover scaling.
- **`StreakHUD` & `XPProgressBar`:** Real-time animated indicators communicating level progress, tier badges, and streak flame counters.

---

## 11. CONFIGURATION, FEATURE FLAGS & DEPLOYMENT PLAYBOOK

### 11.1. Environment Variables Configuration

| Variable Name | Environment | Required? | Default / Example | Purpose |
|:---|:---:|:---:|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | All | **Yes** | `https://xyz.supabase.co` | Supabase Project Gateway URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | **Yes** | `eyJhbGci...` | Supabase Public Anonymous API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | **Yes** | `eyJhbGci...` | Privileged key (bypasses RLS for XP & Payments) |
| `DEEPSEEK_API_KEY` | Server | Optional | `sk-...` | DeepSeek LLM Key (empty enables Mock Mode) |
| `DEEPSEEK_BASE_URL` | Server | Optional | `https://api.deepseek.com` | DeepSeek API Base Endpoint |
| `DEEPSEEK_MODEL` | Server | Optional | `deepseek-chat` | Model designation (`deepseek-chat` or `deepseek-reasoner`) |
| `BKASH_APP_KEY` | Server | Optional | `sandbox_key...` | bKash Merchant App Key |
| `BKASH_APP_SECRET` | Server | Optional | `sandbox_secret...` | bKash Merchant App Secret |
| `BKASH_USERNAME` | Server | Optional | `sandbox_user` | bKash Merchant Username |
| `BKASH_PASSWORD` | Server | Optional | `sandbox_pass` | bKash Merchant Password |
| `BKASH_BASE_URL` | Server | Optional | `https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized` | bKash Checkout Gateway Endpoint |
| `FEATURE_FLAGS` | Server | Optional | `{"skillTree":false}` | JSON string enabling/disabling beta subsystems |
| `NODE_ENV` | All | **Yes** | `production` / `development` | Enforces live payment checks in production |

### 11.2. Supabase Migration Execution Order
To deploy the database from scratch, execute the SQL migration scripts in this exact sequence:
1. `supabase/schema.sql` (Core tables: Profiles, Courses, Modules, Lessons, Enrollments, Progress)
2. `supabase/migration_phase1.sql` (Monetization: Pricing & Transactions)
3. `supabase/migration_phase2.sql` (Research preprints & Opportunities)
4. `supabase/supabase_gamification_complete.sql` (XP Audit Log, Quizzes, Atomic functions)
5. `supabase/supabase_arena_patch.sql` (Problem Arena, Attempt limits, Submissions)
6. `supabase/migration_phase3_security.sql` (RBAC normalization & Admin account seeding)
7. `supabase/migration_phase4_community.sql` (Research upvotes RPC & deduplication)
8. `supabase/migration_phase5_perf.sql` (Optimized set-based level recalculation)
9. `supabase/migration_phase6_analytics.sql` (Telemetry logging table)
10. `supabase/seeds/r_course_seeds.sql` (Complete R for Biological Data Science course)
11. `supabase/seeds/gis_course_seeds.sql` (QGIS & Spatial Analytics course)
12. `supabase/seeds/gee_course_seeds.sql` (Google Earth Engine course)

---

## 12. SUMMARY & AGENTIC HANDOFF DIRECTIVE

This context specification encapsulates 100% of the operational logic, security guarantees, architectural invariants, and data models of **INSYT Academy**. Any modification to core systems (gamification math, authorization guards, payment gateways, or code execution runtimes) must adhere strictly to the contracts and security boundaries documented herein.
