# INSYT Academy — UI and UX Context Document

This document serves as the comprehensive, detailed blueprint of the User Interface (UI) and User Experience (UX) of the **INSYT Academy** platform. It describes the design system, user journeys, responsive states, interactive animations, and visual structure of the application. 

This file is structured to provide deep context to developers, designers, and large language model (LLM) agents working on the codebase.

---

## 1. Brand Identity & Visual Design System

INSYT Academy is themed around an **advanced bio-sciences command terminal** or an **interactive laboratory console (INSYT.OS)**. The site targets agricultural, biotech, and bioinformatics students in Bangladesh, using game design principles and immersive design choices to drive high user engagement.

### 1.1 Color Palette
The platform implements a custom, dual-theme color system defined in [tailwind.config.ts](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/tailwind.config.ts) and [app/globals.css](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/globals.css).

```
   DARK MODE (Obsidian & Bio-Luminescent)          LIGHT MODE (High-Contrast Mint)
┌──────────────────────────────────────────┐    ┌──────────────────────────────────────────┐
│ Background:  #070A08 (Deep Obsidian)     │    │ Background:  #F5F7F6 (Pale Mint Tint)    │
│ Card/Panel:  #0D1410 (Agri-Dark)         │    │ Card/Panel:  #FFFFFF (Pure White)        │
│ Secondary:   #111916 (Agri-Deep)         │    │ Border/Ring: #00FF94 (Active Mint)       │
│ Accent:      #00FF94 (Neon Green Glow)   │    │ Accent:      #065F46 (Deep Emerald Text) │
│ Border:      rgba(255,255,255,0.08)      │    │ Text Prim:   #043825 (Dark Green)        │
└──────────────────────────────────────────┘    └──────────────────────────────────────────┘
```

#### Dark Mode (Default)
- **Core Background (`--agri-black`)**: `#070A08` — A deep obsidian dark tone with organic green undertones. Pure black (`#000000`) is reserved for input slots and visual depth containers.
- **Card Background (`--agri-dark` / `--agri-deep`)**: `#0D1410` and `#111916` — Soft obsidian shades used for structural elements, glass card backdrops, and navigation panels.
- **Bioluminescent Accent (`--neon-green`)**: `#00FF94` — A vivid, glowing green representing biological growth, high-tech engineering, and positive progression.
- **Surface Borders (`--border-primary`)**: `rgba(255, 255, 255, 0.08)` — Fine-line, low-opacity border strokes that keep structural dividers subtle and clean.
- **Semantic Accents**:
  - Alert Red (`#FF4D4D`): Destructive inputs, validation errors, proctoring warnings.
  - Alert Amber (`#FFAA00`): Daily streak notifications, code violation warnings, high-difficulty problems.
  - Info Cyan (`#00D4FF`): Bioinformatics tags, helper tips, system logs.
  - bKash Pink (`#E2136E`) & Nagad Orange (`#F26522`): Retained within payment wizard panels.

#### Light Mode (High Contrast & Legibility)
Light mode is built with clean, accessible pale mint tones and deep emerald green text for maximum contrast (conforming to WCAG 2.2 AA standards).
- **Background**: `#F5F7F6` — Clean, soft off-white with a tiny drop of green tint to reduce eye strain.
- **Text Color (`--text-primary`)**: `#043825` — Dark organic green text that provides rich contrast against pale card backdrops.
- **Card Primitives**: Pure `#FFFFFF` (white) with subtle borders in `#00FF94` (active mint) to separate zones.
- **Tag Overrides**: Custom overrides map all discipline-specific colors (e.g. crop-green, bio-purple, forestry-cyan) to neutral, readable grays with clear borders to avoid visual noise.

---

### 1.2 Typography
Typography configurations are set in [app/layout.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/layout.tsx) using Vercel’s **Geist Font Family**:
- **Geist Sans (`GeistSans.variable`)**: Configured for core navigation, marketing headlines, body prose, and UI text. It provides a clean, modern geometric sans-serif aesthetic.
- **Geist Mono (`GeistMono.variable`)**: Paired with JetBrains Mono for coding blocks, calculations, levels, statistics, terminal consoles, and telemetry counters. This reinforces the technical "OS" vibe.

---

### 1.3 Layout Effects & Utility Classes
- **Background Patterns**:
  - `.bg-grid-pattern`: Transparent linear grid overlays (`40px` grid sizes) simulating laboratory coordinates.
  - `.bg-dot-pattern`: A clean radial dot mask (`24px` margins) that gives depth to pages.
- **Glassmorphism**:
  - `.glass`: Background opacity (`rgba(13, 20, 16, 0.6)`) with `backdrop-filter: blur(16px)` and a soft green-border stroke (`rgba(0, 255, 148, 0.08)`).
  - `.glass-strong`: High-opacity variant (`rgba(13, 20, 16, 0.85)`) with a thick border stroke, used in dropdowns, modal windows, and dialog screens.
- **Scrollbar Styling**:
  - Webkit-scrollbar widths are clamped to `6px`.
  - Thumb color: `rgba(0, 255, 148, 0.2)` hovering up to `0.4` for active scrolling states.
- **Skeleton Shimmer**:
  - `.skeleton`: Implements an infinite CSS linear-gradient translation (`shimmer 2s linear infinite`) to show cards loading gracefully.

---

### 1.4 Accessibility Features (WCAG 2.2 AA)
- **Focus Indicators**: The global selector `:focus-visible` forces an outline border of `2px solid rgba(0, 255, 148, 0.5)` with a `2px` offset. This guarantees clear keyboard navigation.
- **Reduced Motion**: Under `@media (prefers-reduced-motion: reduce)`, all transitions are set to `0.001ms` and infinite looping animations (such as pings, pulses, and floaters) are disabled to protect users with vestibular conditions.

---

## 2. UX Tone, Voice, & Gamification Engine

The platform operates as a gamified virtual OS (**INSYT.OS**).

```
   XP GAINED (Atomic Transaction)        AUDIT LOG (Idempotency)          LEVEL RECALCULATION
┌──────────────────────────────┐     ┌─────────────────────────────┐     ┌─────────────────────────────┐
│ 1. Complete Lesson / Quiz    │ ──> │ Write Event to:             │ ──> │ Recalculate Level:          │
│ 2. Submit Code to Arena      │     │ `xp_events` table           │     │ Sum total XP & map to bounds │
│ 3. Instant MCQ Grading       │     │ Unique: (user, event, src)  │     │ Trigger visual level up card│
└──────────────────────────────┘     └─────────────────────────────┘     └─────────────────────────────┘
```

### 2.1 The "Operative" Narrative
- Users are referred to as **Operators** or **Agents**.
- Student ranks are mapped as **OPERATOR** (formerly Student), **INSTRUCTOR**, or **ADMIN** (e.g. in [components/academy/academy-hero.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/academy-hero.tsx)).
- Settings and profile parameters are structured as **OPERATOR CONFIGURATION**, while breadcrumbs show system coordinates like **INSYT.OS // ACADEMY // COURSES**.

### 2.2 Gamification Loop & Streaks
- **XP Logs**: A centralized audit trail records atomic progress writes. XP transactions are mapped to unique keys in the `xp_events` database log, ensuring XP cannot be duplicated or double-claimed.
- **Level Recalculation**: Ranks and levels are derived dynamically using [lib/gamification/levels.ts](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/lib/gamification/levels.ts). Levels scale non-linearly with XP milestones.
- **Daily Streak Loop**: Streaks track consecutive active days. If a user logs in within 24–48 hours of their last completed task, their streak increments; otherwise, it resets. The current streak count is represented visually by a glowing amber fire indicator (`Flame` icon) in the header and hero banners.

---

## 3. Site Structure, Pages, & Route Mapping

The application architecture utilizes Next.js App Router, split into three main layout directories under the `/app` folder.

```
                                      APP STRUCTURE (Next.js App Router)
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         │                                        │                                        │
         ▼                                        ▼                                        ▼
(marketing) [Public Pages]             (dashboard) [User Workspace]               (arena) [Proctored IDE]
  ├── Home (/)                           ├── Academy Portal (/academy)              └── Fullscreen Layout
  ├── Contact (/contact)                 ├── Course Syllabus (/[slug])
  ├── Terms (/terms)                     ├── Lesson Player (/[slug]/[lessonSlug])
  ├── Privacy (/privacy)                 ├── Code Lab / IDE (/academy/simulator)
  └── Refund (/refund)                   ├── Community Bulletin (/community)
                                         ├── Research Articles (/research)
                                         └── Leaderboard (/leaderboard)
```

### 3.1 Public Marketing Routes — `app/(marketing)`
Wrapped by [app/(marketing)/layout.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/(marketing)/layout.tsx), these pages represent the visitor-facing experience.

#### 3.1.1 Landing Homepage — [page.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/(marketing)/page.tsx)
- **Hero Area**: Presents the main value proposition: *"Where Science Meets The Field."* Behind the headline sits an interactive inline SVG vector illustrating bio-tech schematic nodes (circles, dotted orbitals, and organic leaf curves). Includes main CTA buttons: "Start Learning Free" (neon-green) and "Browse Courses" (outlined border).
- **Dynamic Stats Bar**: Fetches live database counts using a service client. Displays total published courses, active registered learners, and available in-browser simulation environments (R and Python labs).
- **Disciplines Selector**: A six-column grid displaying the primary pillars of mastery:
  1. *Crop Science*: Precision farming & crop yield systems.
  2. *Bioinformatics*: Gene sequence alignments & genome processing.
  3. *Livestock & Veterinary*: Animal breeding and husbandry.
  4. *Forestry & Ecology*: Biomass carbon credits and forest ecology.
  5. *Biotech Engineering*: Genetic splicing & molecular biology.
  6. *Research & Data Science*: Scientific programming with R and Python.
- **Testimonials**: Illustrative reviews from early-access biology and agriculture students, displayed as glass cards with star ratings.
- **Footer Navigation**: [site-footer.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/layout/site-footer.tsx) connects users to legal policies: Contact, Privacy, Terms, and Refund pages.

---

### 3.2 Secure Workspace Routes — `app/(dashboard)`
Wrapped by [app/(dashboard)/layout.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/(dashboard)/layout.tsx), these routes form the private dashboard and student learning hub.

#### 3.2.1 Sidebar & Navigation Controls — [dashboard-sidebar.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/layout/dashboard-sidebar.tsx)
- **Layout States**: Operates in two states: Expanded (default desktop width of `w-64`) and Collapsed (icon-only mode of `w-20`). The state toggle is a floating circle button containing `ChevronRight`/`ChevronLeft` arrows.
- **Sidebar Items**: Maps core interactive panels:
  - `Dashboard` (`/academy`)
  - `My Courses` (`/academy/courses`)
  - `Code Lab` (`/academy/simulator`)
  - `Arena` (`/academy/arena`)
  - `Leaderboard` (`/leaderboard`)
  - `Certificates` (`/academy/certificates`)
  - `Settings` (`/academy/settings`)
- **Theme Switcher**: Integrates the theme toggle.
- **User Profile Area**: Positioned at the bottom. Shows the logged-in user's avatar image or name initials, along with their primary designation (OPERATOR or INSTRUCTOR).

#### 3.2.2 Topbar Breadcrumbs — [dashboard-topbar.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/layout/dashboard-topbar.tsx)
- **System Logs breadcrumb**: Renders text string hierarchies based on the current path, e.g. `INSYT.OS > ACADEMY > SIMULATOR`.
- **Notifications Hub**: An interactive icon button showing a red badge when there are unread updates. Clicking it opens a slide-over panel displaying course notifications, certifications, and system logs.

#### 3.2.3 Academy Landing Portal — [app/(dashboard)/academy/page.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/(dashboard)/academy/page.tsx)
- **AcademyHero Banner**: [academy-hero.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/academy-hero.tsx) is a card displaying the user’s level, their current OPERATOR RANK, their total XP progress bar (relative to the next level), streak milestones, and accuracy rating.
- **Interactive Career Skill Tree**: [skill-tree.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/skill-tree.tsx) provides a visual layout of course connections:
  - Implements an interactive canvas mapping node coordinates.
  - Generates connecting SVG lines to show path requirements (e.g. CRISPR basics linked to Bioinformatics pipelines).
  - Interacting with nodes displays detail sheets containing metadata, prerequisites, and learning locks.

#### 3.2.4 Course Detail & Syllabus View — [app/(dashboard)/academy/[slug]/page.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/(dashboard)/academy/[slug]/page.tsx)
- Displays course details, estimated time requirements, skills taught, and difficulty.
- **Syllabus Accordion**: Lists course modules and lessons.
- **Enrollment Flow**: Integrates the [enroll-button.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/enroll-button.tsx). When clicked, it displays the checkout system:
  - Users choose between bKash or Nagad.
  - Implements the payment interface, collecting the phone number and verification OTP.
  - Automatically handles course enrollment upon verification.

#### 3.2.5 Interactive Lesson Player — [app/(dashboard)/academy/[slug]/[lessonSlug]/page.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/(dashboard)/academy/[slug]/[lessonSlug]/page.tsx)
- **Split Layout**:
  - **Left Navigation**: [course-sidebar.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/course-sidebar.tsx) shows a list of course items with checkboxes indicating completion.
  - **Right Content Pane**: Contains tab options (Video, Reading Notes, Code Sandbox):
    - *Video Tab*: Implements the custom player [video-player.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/video-player.tsx).
    - *Reading Tab*: Shows rich lesson text, including mathematical formulas rendered using LaTeX.
    - *Code Sandbox Launcher*: Launches the in-browser simulator.
- **Quizzes**: Quizzes are rendered in [quiz-player.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/quiz-player.tsx). Multiple-choice questions display as radio buttons with custom selection indicators, calculating scores instantly and celebrating level milestones.

---

### 3.3 Competitive Coding Arena — `app/(dashboard)/academy/arena`
The arena provides time-limited coding challenges.

```
       1. CHOOSE CHALLENGE               2. STARTING GATE (Rules)             3. CORE SOLVING ENVIRONMENT
┌──────────────────────────────┐     ┌──────────────────────────────┐     ┌──────────────────────────────┐
│ Lists active challenges with │ ──> │ Renders time limits, attempt │ ──> │ Splits screen:               │
│ difficulty tags & XP rewards │     │ bounds, and XP reward value  │     │ Left: Markdown Instructions  │
└──────────────────────────────┘     └──────────────────────────────┘     │ Right: Code Editor & inputs  │
                                                                          └──────────────────────────────┘
```

#### 3.3.1 Gate Phase — Pre-Start Screen
Shows the problem title, tags, XP reward, and a countdown limit. Includes guidelines for the challenge:
- Time limit details.
- Daily attempt limit warning.
- XP reward rules.
- A "Start Solving" button to launch the timer and enter the coding interface.

#### 3.3.2 Solving Phase — Coding Interface
Once started, the page enters a split-screen view:
- **Left Panel**: Contains the problem description, equations, input constraints, and optional hint cards.
- **Right Panel**: A code editing workspace:
  - An R/Python text editor showing code syntax and line indicators.
  - An input field to submit the final calculated answer.
  - **Submit Button**: Submits the solution for evaluation.
- **Telemetry Bar**: Monitors focus, elapsed time, and violations.
- **AI Camera Monitor Overlay**: [camera-monitor.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/arena/camera-monitor.tsx) displays a proctoring webcam frame in the corner to verify the student's presence during the challenge.

#### 3.3.3 Outcome Evaluation Phase
Upon submission or timer expiration:
- **Correct Submission**: Celebrates the result and displays the XP reward.
- **Incorrect Submission**: Prompts the user to review their code and retry.
- **Timer Expiration**: Auto-submits the current workspace code for grading.

---

### 3.4 Interactive WASM IDE & Simulator — `/academy/simulator`
A client-side playground powered by WebAssembly (WASM) to run R and Python code in the browser.

- **Dynamic Tabs**:
  - *Code Editor*: Integrates Monaco Editor, featuring syntax highlighting, line numbers, and custom auto-completion.
  - *Output Console*: Displays program logs, variables, plots, and computation errors.
  - *AI Assistant Panel*: [assistant-panel.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/simulator/assistant-panel.tsx) provides a direct dialogue window with the AI study assistant (powered by the Gemini API).
  - *Terminal Console*: Implements R/Python execution loops inside the browser.
- **WASM Runtimes**: Loads WebR for R code and Pyodide for Python processing, allowing students to run data science tasks locally without installing software.

---

### 3.5 Community Feed — `/community`
A collaborative discussion board for students to post code, ask questions, and share insights.

- **Filtering Banners**: Users can filter posts by category (Crop Science, Bioinformatics, Biotech, etc.).
- **Code Block Execution**: Code snippets in posts can be executed directly in the browser via sandboxed runners.
- **Upvoting & Comments**: Includes upvote counters and nested reply threads for discussions.

---

### 3.6 Research Preprint Feed — `/research`
A curation tool displaying agricultural preprints, forestry journals, and biotech publications.

- **Paper Cards**: [paper-card.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/research/paper-card.tsx) displays title, abstract, authors, category tag, and links to source documents.
- **Action Toolbar**: [article-actions.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/research/article-actions.tsx) lets users save, bookmark, and share publications.

---

### 3.7 Competitive Leaderboards — `/leaderboard`
Renders weekly and monthly rankings of all users on the platform.

- Lists top students, displaying their rank, level, total accumulated XP, and custom user avatars.
- Highlights the current user's rank relative to their cohort.

---

## 4. UI Component Directory Mapping

Below is the directory map of reusable UI components:

| Component Path | Visual Representation | UX Role |
| :--- | :--- | :--- |
| [components/ui/glass-card.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/ui/glass-card.tsx) | Semi-transparent pane, clean border stroke | The standard card container used across all dashboards. |
| [components/ui/button.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/ui/button.tsx) | Neon-accented, solid, ghost, or outline states | Interactive button with hover scaling and active click states. |
| [components/ui/status-badge.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/ui/status-badge.tsx) | Rounded tag with pinging indicator light | Displays active states, system health, and difficulty levels. |
| [components/ui/theme-toggle.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/ui/theme-toggle.tsx) | Sun/Moon icon button with spin transition | Toggles the visual theme (Light / Dark mode). |
| [components/academy/academy-hero.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/academy-hero.tsx) | Level tracker HUD with progress bar | Displays user level, streak, total XP, and learning stats. |
| [components/academy/skill-tree.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/skill-tree.tsx) | Interactive network diagram with SVG lines | Maps prerequisite course requirements. |
| [components/academy/quiz-player.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/academy/quiz-player.tsx) | Interactive MCQ layout | Renders lesson quizzes, progress indicators, and instant grading. |
| [components/arena/secure-arena-wrapper.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/arena/secure-arena-wrapper.tsx) | Split-screen terminal editor with timer HUD | Main interface for proctored coding challenges. |
| [components/simulator/ide.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/simulator/ide.tsx) | Tabbed code editor and execution console | In-browser R/Python coding playground. |
| [components/community/community-client.tsx](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/components/community/community-client.tsx) | Interactive feed grid with post creator | Discussion board interface for students. |

---

## 5. UI/UX Optimization Checklist

For future design audits, ensure these visual and interactive standards are maintained:
1. **WCAG Compliance**: All text elements must maintain a contrast ratio of at least 4.5:1. Pay close attention to secondary grays in dark mode.
2. **Responsive Constraints**: Columns, IDE panels, and the career skill tree must scale down cleanly or scroll horizontally on narrow displays (less than `768px`).
3. **Animations**: Keep animations functional. Use micro-interactions for button hovers and key milestones, while respecting user preferences for reduced motion.
4. **Theme Transitions**: Class overrides in [app/globals.css](file:///d:/Insyt%20All%20Web%20V/insyt%20academy/app/globals.css) must update layout containers, inputs, borders, and typography instantly when the theme is toggled.
