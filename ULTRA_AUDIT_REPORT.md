# ULTRA AUDIT REPORT — INSYT Academy

**Product:** INSYT Academy — gamified LMS + competitive coding arena + research preprint hub for agricultural/biotech education (Bangladesh-focused).
**Stack:** Next.js 14.2 (App Router) · React 18 · Supabase (Postgres + Auth + RLS) · Tailwind · framer-motion · Gemini API · Pyodide/webR (WASM).
**Reviewed by:** Independent review board (Vercel/Stripe/Linear/Notion/Cloudflare/Supabase/Google/W3C/Netflix/Anthropic principals).
**Date:** 2026-06-01
**Verdict in one line:** Visually ambitious, feature-broad, but **not launch-ready**. Multiple catastrophic security holes, fabricated subsystems presented as real, and accessibility/scale failures. This is a polished prototype, not a product expecting millions of users.

> Note on tone: as requested, this is adversarial. There is no praise section. Where something is done correctly it is noted only to keep severity scoring honest.

---

# Executive Summary

INSYT Academy is a sprawling, genuinely ambitious build: an LMS with sector-personalized lesson content (a legitimately good idea), server-scored quizzes, an idempotent XP/streak/leaderboard gamification engine, a proctored coding arena, an in-browser R/Python IDE, a community hub, and a research feed. The surface area is large and the visual identity is strong.

But the product is held together by **illusions**. The three things a user would pay for or trust — **payments, proctoring, and code execution** — are substantially **faked**:

1. **Payments are theater.** The enroll flow harvests a real mobile-wallet **PIN and OTP** into client state, runs cosmetic `setTimeout` animations, then grants enrollment for free (`components/academy/enroll-button.tsx`). The "real" payment API that exists alongside it (`app/api/payment/callback/route.ts`) is **unauthenticated and unsigned** — anyone can POST `{trxId, status:"SUCCESS"}` and self-grant a paid course. There is no actual bKash/Nagad/SSLCommerz integration anywhere.
2. **Proctoring is theater.** The "AI proctoring" (`components/arena/camera-monitor.tsx`) is hardcoded to `facePresent=true, phoneDetected=false`. No detection runs. Camera frames are never stored. A "Start without Camera" button opts out entirely. Yet the UI advertises "AI proctoring detected a mobile phone." This is a false-advertising/fraud exposure.
3. **Code execution is partly theater.** The terminal/simulator returns **canned constants** (`mean()` always `24.5`, `sum()` always `150`) via server-side `new Function()` eval, while the community feed runs **untrusted post code through `new Function()` in the victim's browser** (stored-XSS-grade RCE).

On top of that: the platform's super-admin is a **hardcoded personal Gmail** (`z65gt9@gmail.com`) compiled into both server actions and the client bundle; if that address is unregistered, **whoever signs up with it first becomes platform admin**. There is **no `middleware.ts`** — zero edge route protection — and several instructor pages leak student PII to any logged-in user. AI endpoints have **no auth and no rate limiting** (denial-of-wallet). Accessibility is near-absent (1 `aria-label` in the entire codebase; quizzes are un-keyboard-navigable buttons). Many "live" dashboards (research, skill tree, system health, marketing stats) are hardcoded mock data.

**This cannot launch to paying users in its current state.** It needs a security remediation pass (P0), removal/relabeling of all fake subsystems (P0), and an accessibility/scale pass (P1) before it is even a credible beta.

---

# Overall Score

## **41 / 100** — Not launch-ready

Weighted by launch risk (security and trust weighted heavily). The score is dragged down primarily by Security (18) and Accessibility (22). The underlying LMS/gamification data model is the strongest part and is the reason this isn't lower.

| Domain | Score |
|---|---|
| Architecture | 46 |
| Frontend | 48 |
| Backend | 34 |
| Database | 56 |
| Security | 18 |
| Performance | 40 |
| UI | 52 |
| UX | 40 |
| Accessibility | 22 |
| Mobile | 45 |
| Gamification | 56 |
| LMS | 58 |
| Product | 40 |

---

# Architecture Score: 46/100

**Folder structure** is reasonable on the surface — Next.js route groups (`(marketing)`, `(dashboard)`, `(arena)`), a `components/` tree split by domain, `actions/` for server logic, `lib/` for infra. Domain separation is *attempted*. But cohesion breaks down fast:

- **No central auth boundary.** There is no `middleware.ts`. Authorization is re-implemented (inconsistently) in every page/action. This is the single biggest architectural flaw — security is a property you must remember to add per-file, and several files forgot.
- **RLS is dead code.** The arena/problems paths and all admin paths use `createAdminClient()` (service role, "bypasses ALL RLS"). The elaborate RLS in `supabase_arena_patch.sql` and `schema.sql` is never exercised on those paths, so there is **zero defense-in-depth** — one forgotten `.eq('user_id', …)` is a full data leak.
- **Three parallel SQL "sources of truth"** (`supabase/schema.sql`, `supabase/migration_phase1/2.sql`, root `supabase_gamification_complete.sql`, `supabase_arena_patch.sql`) with overlapping/`DROP`-ing definitions and no migration tool (no Supabase CLI migrations dir with timestamps used in order). Schema state is not reproducible; it depends on the order a human ran files.
- **Dead/no-op infrastructure:** `lib/queue.ts` is a fire-and-forget `console.log` that claims durability it doesn't have; `actions/ide.ts.executeCode` is exported but documented as removed; `components/ui/select.tsx`, `command.tsx`, `popover.tsx` are unused.
- **Duplicated constants:** the `files/` directory and `brain/…/scratch/` and `scratch/` contain stale duplicate copies of gamification/quiz/admin files and DB dump scripts checked into the deployable tree.

**Technical debt is high and load-bearing.** Several "features" are mock data wired to real-looking UI, which is debt that actively misleads.

---

# Frontend Score: 48/100

- **Client/server split is wrong-way-round.** ~**51 of 92** `.tsx` files (55%) are `"use client"`. Many are gratuitous: `components/ui/button.tsx`, `scroll-area.tsx`, `bento-grid.tsx`, `video-player.tsx` are client components with no client logic, forcing client boundaries down every import tree and inflating the bundle.
- **Dead heavyweight dependencies.** `@tensorflow/tfjs` (multi-MB) is in `package.json` but imported **nowhere** (the camera monitor references a global `window.cocoSsdModel` that's never loaded). `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` are installed but `components/academy/lesson-content.tsx` ships a **hand-rolled string-split Markdown parser** instead. `framer-motion` is pulled into `bento-grid.tsx` purely for a `whileHover={{scale:1.02}}` that CSS does for free.
- **FOUC + hydration mismatch.** `components/providers/theme-provider.tsx` applies the theme class in `useEffect` (post-mount); `<html lang="en">` has no `suppressHydrationWarning` and there's no blocking pre-paint script → flash of wrong theme on every load + a React hydration warning.
- **Redundant client auth round-trips.** `dashboard-topbar.tsx` and `site-header.tsx` re-fetch the session client-side even though the server layout already has the authenticated user.
- **`app/globals.css` is a 483-line `!important` battlefield** with universal `* { … !important }` rules and a light mode that redefines `--agri-dark` to neon green, kept correct only by ~200 lines of brittle attribute-selector overrides keyed to exact opacity classes.

State management is mostly local `useState` (fine for this size), but several `useEffect` hooks rely on `eslint-disable react-hooks/exhaustive-deps` and carry stale-closure bugs (quiz timers).

---

# Backend Score: 34/100

The server-action layer is where the worst correctness/security defects live:

- **Missing authorization** on `createCourse`/`updateCourse` (`actions/instructor.ts`) — only `if (!user)`, no role check; `updateCourse(id, data: any)` updates arbitrary rows with arbitrary fields. (Currently only saved from full takeover by an accidental missing RLS write policy — i.e., the feature is *both* a latent privilege-escalation bug *and* silently broken for real instructors.)
- **No auth + no rate limiting** on `actions/assistant.ts` / `actions/translate.ts` → open denial-of-wallet on the Gemini key.
- **Prompt injection** — user code/chat concatenated into the system prompt; client controls the entire `messages` array including fake "model" turns.
- **Server-side `new Function()` eval** on request data in `actions/ide.ts` and `actions/simulator.ts` (gated only by a regex — one relaxation from RCE).
- **Client-trusted integrity signals** — `submitProblemCode` trusts client-sent `violation_count`, `proctoring_active`, and `started_at` (the latter drives the entire daily-limit/lockout logic → trivially bypassed).
- **Raw DB error strings returned to the client** across `instructor.ts`, `community.ts`, `admin-problems.ts` (schema disclosure).
- **No input validation** (no zod/schema) on any action; `data: any` spreads straight into inserts.
- **Unguarded fan-out writes** — `createNotification`/`triggerBypassCheck` are exported server actions that write notifications to arbitrary users with attacker-supplied content (spam/phishing/DoS).
- **Caching:** heavy reliance on `revalidatePath`; reasonable, but blocking gamification queries run on **every** dashboard navigation (`getUserGamificationProfile`, `updateUserStreak`).

---

# Database Score: 56/100

The data model is the **strongest** part of the system — and still has serious holes.

**Good (for scoring honesty):**
- Sensible normalization: `courses → modules → lessons`, separate `enrollments`, `user_progress`, `quizzes/quiz_questions/quiz_submissions`, `certificates`, `transactions`, `course_pricing`.
- An **idempotent XP audit log** (`xp_events` with `UNIQUE(user_id, event_type, source_id)`) and an atomic `award_xp()` `SECURITY DEFINER` function — genuinely the right pattern.
- Indexes exist where they matter (`idx_transactions_*`, `idx_profiles_xp_desc`, `idx_xp_events_*`, leaderboard partial indexes).

**Bad:**
- **The community upvote UPDATE policy is a tautology:** `USING (auth.uid() = author_id OR upvotes = upvotes + 1)` — `upvotes = upvotes + 1` is always false, so only authors can update; cross-user upvotes silently fail. And there's no `post_votes` dedupe table, so a user can upvote their own post infinitely. (`supabase/schema.sql:254`)
- **RLS bypassed in practice** by service-role usage everywhere (see Architecture/Security).
- **No DB-level integrity backstop** for arena attempt limits — enforcement is "application layer" with a check-then-insert race (`supabase_arena_patch.sql`, `actions/problems.ts`). The provided `has_attempted_today()` function is defined but never called.
- **`recalculate_user_level()` runs on every `user_progress` insert/delete** and loops over **all courses** for the user each time — O(courses) work per lesson completion; this is a write-amplification time bomb as the catalog grows.
- **Schema reproducibility** is not guaranteed (multiple overlapping `DROP`/`CREATE` files, no ordered migrations).
- **`profiles` had both `xp` and `total_xp`** at different times; the migration copies and drops `xp` — fragile if files run out of order.

---

# Security Score: 18/100

This is the section that blocks launch. Sorted worst-first.

1. **CRITICAL — Payment callback is an unauthenticated, unsigned free-enrollment forgery.** `app/api/payment/callback/route.ts` uses the **service-role** client and accepts `{trxId, status, pgTxId}` straight from the request body. No auth, no HMAC/signature from any payment gateway, no idempotency beyond "already SUCCESS." Any user (or anyone who can guess/obtain a pending `trxId` — which the initialize route hands back to the client) can POST `status:"SUCCESS"` and **auto-create an enrollment without paying**.
2. **CRITICAL — The entire payment UX is fake and harvests wallet PIN/OTP.** `components/academy/enroll-button.tsx` collects mobile number + OTP + **payment PIN** (`type="password"`) into React state, animates, then calls `enrollCourse()` directly — bypassing even the (broken) payment API. Trains users to type their bKash/Nagad PIN into a fake form. No revenue is ever collected.
3. **CRITICAL — Hardcoded personal super-admin email, claimable + client-leaked.** `z65gt9@gmail.com` is the admin gate in `app/(dashboard)/admin/page.tsx`, `actions/admin-problems.ts`, `actions/problems.ts`, **and shipped to the browser** in `components/gamification/LeaderboardWidget.tsx` and `components/arena/secure-arena-wrapper.tsx`. If that email isn't a registered Supabase user, the first person to sign up with it becomes platform admin. The client-side checks are spoofable in devtools.
4. **CRITICAL — AI endpoints: no auth, no rate limit (denial-of-wallet).** `actions/assistant.ts` and `actions/translate.ts` never check `auth.getUser()` and have zero throttling. A loop drains your Gemini budget and takes the feature down.
5. **CRITICAL — Stored-XSS / RCE via community code runner.** `components/community/community-client.tsx` runs any post's `code_block` through `new Function()` in the victim's browser on "RUN" — full access to cookies/session/`fetch`. Account takeover for anyone who clicks run on a malicious post.
6. **HIGH — No `middleware.ts`.** No edge route protection or session refresh. `/instructor/**` and `/admin/**` are guarded only by per-page checks, several of which are missing.
7. **HIGH — Student PII leak.** `app/(dashboard)/instructor/students/page.tsx` and `analytics/page.tsx` have **no role check** (parent layout is a client UI shell); any logged-in user reaches them. The students page renders names/emails.
8. **HIGH — Client-trusted anti-cheat & limits.** `violation_count`, `proctoring_active`, `started_at` all come from the client; daily limits, lockouts, and "proctored" flags are forgeable.
9. **HIGH — Prompt injection** (`actions/assistant.ts`) — system prompt is escapable; client controls full message history.
10. **HIGH — Server-side `new Function()` eval** (`actions/ide.ts`, `actions/simulator.ts`).
11. **HIGH — Unguarded notification fan-out** (`actions/notifications.ts` `createNotification`, `triggerBypassCheck`) — spam/phishing/DoS to arbitrary users.
12. **MEDIUM — `createServiceClient()` fails open** — if the service key is missing it `console.warn`s and falls back to the anon key instead of throwing (`lib/supabase/server.ts:31-38`); silent behavior change.
13. **MEDIUM — Unvalidated URLs** in research/community (`pdf_url`, `dataset_url`) rendered as `href` → `javascript:` scheme risk.
14. **MEDIUM — Raw error message disclosure** across actions and `app/error.tsx`.
15. **LOW — Repo hygiene:** `dump_profiles.js`, `scratch/`, `brain/…/scratch/check-db.js`, `files/` committed in the deployable tree; confirm none embed the service key. `lint.txt`, `problem_prompt.txt`, `project_context.txt` (873 KB source dump) also committed.

No CSRF tokens on the payment route (Next server actions have some origin protection; raw route handlers do not). No rate limiting anywhere in the codebase.

---

# Performance Score: 40/100

- **Unbounded queries / no pagination.** `actions/community.ts getCommunityPosts` selects **all** posts **and all nested replies** with no limit. `instructor/page.tsx` pulls **all** `problem_attempts` and **all** `profiles.total_xp` into memory to `.length`/`.reduce`. `students/page.tsx` computes "total" stats over only a 50-row window (wrong numbers at scale).
- **Blocking work on every navigation.** Dashboard layout `await`s `getUserGamificationProfile()` and fires `updateUserStreak()` on every load; the fetched `xpData` is then **never rendered** (sidebar ignores it).
- **Write amplification.** `recalculate_user_level()` loops all courses on every lesson completion.
- **N+1 sequential awaits** in `syncSystemNotifications` (per-course + per-article `await createNotification`).
- **Bundle bloat** — tfjs/react-markdown dead weight, 55% client components, framer-motion for CSS-able hovers.
- **WASM runtimes** (Pyodide ~10MB+, webR) loaded from third-party CDNs with no SRI on the IDE page.

**Estimated behavior under load:**
- **100 users:** Fine. Nobody notices.
- **1,000 users:** Community feed and instructor dashboards start to feel heavy (full-table fetches). Manual arena review queue begins to back up.
- **10,000 users:** Unbounded feeds and `recalculate_user_level` write amplification cause visible latency; leaderboard cache helps reads but profile writes contend. Gemini cost-abuse becomes a real bill. Manual problem grading is hopeless.
- **100,000 users:** Community/instructor pages time out without pagination; per-navigation gamification queries dominate DB load; the no-op `lib/queue.ts` silently drops analytics. Denial-of-wallet on AI is trivial.
- **1,000,000 users:** Non-functional without a rearchitecture (pagination, caching/CDN, queue, auto-grading, rate limiting, and removal of per-request recalculation).

---

# UI Score: 52/100

The cyberpunk "bio-luminescent terminal" aesthetic is cohesive and distinctive — the one area with real craft. But:
- **Contrast failures everywhere.** `text-gray-500` (≈151 uses) = 4.11:1 and `text-gray-600` (≈41 uses) = 2.63:1 on the near-black background — both fail WCAG AA. (The neon-green `#00FF94` is fine at ~14.9:1; the *grays* are the problem.)
- **Fabricated content shown as real:** marketing stats ("2,500+ Active Learners", "95% Completion Rate"), named testimonials, "Updated Recently!" on the leaderboard, the entire skill tree, and the "System Health" panel are hardcoded.
- **Broken visuals:** skill-tree SVG connectors use hardcoded pixel coords that detach from the scrollable node container; `w-[900px]` overflows mobile.
- **`site-footer.tsx`** is a full-bleed neon-green block with **no links** (no Privacy/Terms/Contact — a legal gap for a paid product).
- **Brittle theming** (`globals.css` `!important` war) makes light mode visually unstable.

---

# UX Score: 40/100

- **Identity crisis.** An agricultural/biotech *education* product dressed as a cyberpunk spy console: "OPERATIVE DESIGNATION (FULL NAME)", "ACCESS MAINFRAME", "Don't have clearance?", default username "Agent", "Cyber-Lab", "Coordinates Lost". A farmer or grad student cannot parse "OPERATIVE DESIGNATION = full name." Jargon obscures function and hurts conversion/trust.
- **Contradictory attempt policy.** Arena says "5/5 remaining," rules say "one attempt per day," code locks after one submission until manual review (which may never come). Guaranteed support tickets and disputes.
- **Dead-end flows.** Quizzes auto-advance on stale state; "Time's up, code auto-submitted" shows even when nothing was submitted; locked skill nodes still respond to clicks.
- **No onboarding.** New users land in a jargon-heavy dashboard with fake skill trees and no guided first lesson.

---

# Accessibility Score: 22/100

Near-absent. Measured signals across the whole codebase:
- `aria-label`: **1** occurrence. `htmlFor`: 5 (dozens of fields). `autoComplete`: 2. `prefers-reduced-motion`: **0** (despite infinite `animate-ping`/`animate-pulse` + framer-motion everywhere).
- **Quiz answers are `<button>`s, not radios** (`QuizWrapper.tsx`, `quiz-player.tsx`) — no `radiogroup`, `aria-checked`, or arrow-key nav. The core learning interaction is unusable by keyboard/screen-reader users — unacceptable for an education product (WCAG 4.1.2 / 1.3.1).
- **Form labels not associated** (login/signup/404); no autocomplete; password managers can't fill.
- **Contrast** fails AA broadly (grays above).
- **Iframe video** has no `title`; `<video>` has no captions track.
- No focus-visible management on custom interactive `<div>`s (e.g., `ui/select.tsx` trigger is a non-focusable `<div>`).

---

# Mobile Score: 45/100

- **Touch targets below 44px:** icon buttons `h-10 w-10` (40px), sidebar collapse handle `h-7 w-7` (28px), quiz progress dots `w-5 h-5` (20px).
- **Fixed widths that overflow:** skill tree `w-[900px]`; some terminal/IDE panels.
- **Sidebar collapse** is driven by toggling a class on `<html>` plus a `!important` override against a static `md:pl-64` — fragile and easy to desync.
- The dashboard does collapse to a top bar on mobile (`pt-14 md:pl-64`), so it's not all broken — but the arena/IDE and skill tree are effectively desktop-only.
- No `prefers-reduced-motion` → battery/CPU drain from infinite animations on phones.

---

# Gamification Score: 56/100

Compared to Duolingo/Khan/Codecademy/Habitica:
- **Mechanics present:** XP (idempotent via `xp_events`), levels, daily streaks with 7-day bonus, leaderboard (cached, global + cohort-ready), course XP summaries, level-up bursts.
- **Where it loses:** levels are derived from *course completion percentage* summed across all courses (a confusing, unbounded definition users can't reason about, recomputed expensively on every progress write). No badges/achievements that are real (skill tree is fake). No social/friend loops, no streak freeze, no notifications that nudge return (the notification system exists but is spammy/unguarded). XP is **exploitable** (client-controlled arena attempts; per-attempt XP regrind because the idempotency key includes `attempt_id`). Engagement loop is shallow vs Duolingo's daily-goal + streak-freeze + league mechanics.

---

# LMS Score: 58/100 (highest)

- **Genuinely good idea:** sector/sub-sector **content variants** (`lessons.content_variants` JSONB resolved in `actions/get-lesson.ts`) — adaptive content by learner background, with sub_sector > sector > default fallback. This is differentiated and well-implemented.
- Sequential lesson locking with Admin/Instructor bypass; server-side quiz scoring (correct answers never sent to client); certificate issuance on 100% completion.
- **Where it loses:** the arena's "answer" model is dead — `expected_answer` is stored but never auto-graded; **every** submission requires manual admin review, which does not scale and leaves XP unawarded → churn. The simulator returns fake results, which is *educationally fraudulent* for a coding course. No assessments beyond MCQ + manual code review (no autograded code tests, no rubrics, no peer review that works). No spaced repetition, no progress analytics for learners.

---

# Product Score: 40/100

**Why would users leave?**
- They type their wallet PIN into a fake form, or pay and realize others got it free.
- They run `sum(c(1,2))` and get `150` — trust in the "learn to code" promise collapses.
- They submit one arena problem, get locked out "under review" forever, and see "5 attempts" they never got.
- Screen-reader/keyboard users can't take a quiz at all.
- The jargon makes the first five minutes feel like a video game cosplay, not a course.

**Why would users stay?**
- The sector-personalized lessons are genuinely useful and rare.
- The aesthetic is memorable.
- The gamification, where it works, is sticky.
- The R/Python WASM IDE (the *real* one, not the fake terminal) is a strong feature.

**What's missing:** real payments, real proctoring or honest labeling, auto-grading, accessibility, pagination/scale, onboarding, legal pages, real analytics, content moderation, email/notification that nudges retention, search.

**What to remove:** the fake payment wizard, the fake terminal, the fake skill tree, the fake "system health," tfjs, dead UI primitives, the no-op queue, `actions/ide.ts`.

**What to simplify:** the jargon (plain language for core flows), the triple-source SQL (adopt one migration tool), the `globals.css` `!important` war.

**What to redesign:** auth/authorization (middleware + role model), the arena attempt/grading model, the gamification level definition.

**What would make it world-class:** real auto-graded coding assessments, honest+real proctoring (or drop it), a coherent learner-first voice, WCAG AA, a real payment integration with webhooks/signatures, and pagination/caching for scale.

---

# Critical Issues

> Severity · File · Reason · User impact · Business impact · Fix · Effort

### CR-1 · Payment callback forgery (free enrollment)
- **Severity:** Critical
- **File:** `app/api/payment/callback/route.ts:4-56`
- **Reason:** Service-role client + accepts `{trxId, status}` from request body; no auth, no gateway signature/HMAC, no verification that money moved.
- **User impact:** Anyone marks their own pending transaction `SUCCESS` → free paid courses.
- **Business impact:** Zero revenue assurance; total monetization bypass; fraud.
- **Fix:** Verify a real gateway signature (bKash/Nagad/SSLCommerz webhook HMAC); never trust client-sent `status`; validate the payment against the gateway's verify API server-to-server; idempotency key on gateway tx id.
- **Effort:** L (3–5 days, requires real gateway integration).

### CR-2 · Fake payment wizard harvests wallet PIN/OTP
- **Severity:** Critical
- **File:** `components/academy/enroll-button.tsx:62-138,188,318-348`
- **Reason:** Collects mobile + OTP + PIN client-side, cosmetic delay, calls `enrollCourse()` directly; price hardcoded `1500.00`.
- **User impact:** Trains users to phish themselves; enrollment granted free.
- **Business impact:** Regulatory/financial exposure (Bangladesh Bank/PCI); brand destruction if exploited.
- **Fix:** Delete the wizard; redirect to a real hosted gateway checkout; never collect PINs.
- **Effort:** L (1–2 days once CR-1 gateway exists).

### CR-3 · Hardcoded super-admin email (claimable + client-leaked)
- **Severity:** Critical
- **File:** `app/(dashboard)/admin/page.tsx:14`; `actions/admin-problems.ts:25`; `actions/problems.ts:75,135,188`; `components/gamification/LeaderboardWidget.tsx:140`; `components/arena/secure-arena-wrapper.tsx:60`
- **Reason:** Admin = `email === "z65gt9@gmail.com"`, shipped to the browser; client checks spoofable; if email unregistered, first signup claims admin.
- **User impact:** Platform takeover.
- **Business impact:** Catastrophic, non-revocable without redeploy; PII in bundle.
- **Fix:** Use `profiles.role`/`is_admin` (column exists) verified server-side only; remove the literal everywhere; never send emails to client; claim+MFA the account.
- **Effort:** M (half day).

### CR-4 · AI endpoints: no auth, no rate limit (denial-of-wallet)
- **Severity:** Critical
- **File:** `actions/assistant.ts:8-79`; `actions/translate.ts:3-63`
- **Reason:** No `auth.getUser()`, no throttle, unbounded prompt/history.
- **User impact:** Feature taken down for paying users when quota drained.
- **Business impact:** Unbounded Gemini spend.
- **Fix:** Require auth; per-user rate limit (Upstash/token bucket); cap input size; pass system prompt via system role.
- **Effort:** M (1 day).

### CR-5 · Stored-XSS/RCE via community `new Function()` runner
- **Severity:** Critical
- **File:** `components/community/community-client.tsx:18-33,151-163,306`
- **Reason:** Untrusted post `code_block` executed in victim browser with full origin scope.
- **User impact:** Session/cookie theft, account takeover on "RUN."
- **Business impact:** Mass account compromise vector.
- **Fix:** Remove the JS-run feature, or run in a sandboxed iframe (`sandbox="allow-scripts"`, no `allow-same-origin`)/Web Worker.
- **Effort:** M (1–2 days for real sandbox; S to remove).

### CR-6 · Proctoring is fake while advertised as real
- **Severity:** Critical (legal/trust)
- **File:** `components/arena/camera-monitor.tsx:41-54`; `components/arena/secure-arena-wrapper.tsx:341-347,431`
- **Reason:** Detection hardcoded to pass; no frames stored; "Start without Camera" opt-out; UI claims "AI proctoring detected a mobile phone."
- **User impact:** Cheaters unaffected; credentials meaningless.
- **Business impact:** False-advertising/fraud exposure; worthless certificates.
- **Fix:** Implement real detection (MediaPipe/coco-ssd) + server adjudication + frame storage, **or** remove all "proctored/AI" claims and the fake lockout.
- **Effort:** Real: 1–2 weeks. Honest relabel: 4–6 h.

---

# High Issues

### H-1 · No `middleware.ts` (no edge route protection / session refresh)
- **Severity:** High · **File:** repo root (absent); assumption in `lib/supabase/server.ts:21-23`
- **Reason:** Auth enforced per-page, inconsistently; sessions may not refresh.
- **Impact:** Coverage gaps (see H-2); intermittent logouts.
- **Fix:** Add `middleware.ts` to refresh session + gate `/instructor/**`,`/admin/**` by role.
- **Effort:** M (4 h).

### H-2 · Instructor analytics/students pages have no role check (PII leak)
- **Severity:** High · **File:** `app/(dashboard)/instructor/analytics/page.tsx:6-46`; `app/(dashboard)/instructor/students/page.tsx:6-23,99-103`
- **Reason:** No `auth.getUser()` role check; parent layout is a client UI shell.
- **Impact:** Any logged-in user sees student names/emails + platform metrics.
- **Fix:** Add server-side role guard (mirror `instructor/problems/page.tsx:14-25`); ideally a server `(guard)` layout.
- **Effort:** S (2–3 h).

### H-3 · `createCourse`/`updateCourse` missing role check + `data: any`
- **Severity:** High · **File:** `actions/instructor.ts:6-44`
- **Reason:** Only `if(!user)`; arbitrary id + fields; no ownership check. Latent privilege escalation; currently also broken (no courses write RLS).
- **Impact:** Future full CMS takeover; today instructors can't create courses.
- **Fix:** `assertAdmin()` guard; whitelist fields; ownership filter; add INSERT/UPDATE RLS on `courses`.
- **Effort:** M (4–6 h).

### H-4 · Community upvote RLS tautology + no vote dedupe
- **Severity:** High · **File:** `supabase/schema.sql:254`; `actions/community.ts:185-231`
- **Reason:** `upvotes = upvotes + 1` always false → cross-user upvotes silently fail; read-modify-write allows infinite self-upvotes.
- **Impact:** Social-proof metric meaningless/gameable.
- **Fix:** `post_votes(user_id,post_id)` unique table + `increment_upvotes()` SECURITY DEFINER RPC; revert optimistic UI on failure.
- **Effort:** M (4–6 h).

### H-5 · Client-trusted arena integrity (`started_at`, `violation_count`, `proctoring_active`)
- **Severity:** High · **File:** `actions/problems.ts:169,192-205,213,224`; `components/arena/secure-arena-wrapper.tsx:215,236,244`
- **Reason:** Daily limits/lockouts/proctor flag derived from client-sent values.
- **Impact:** Limits bypassed by cheaters; false lockouts for honest users.
- **Fix:** Server-derive timestamps (`now()`); never trust client violation/proctor data; atomic count+insert RPC.
- **Effort:** M (1 day).

### H-6 · Prompt injection in AI assistant
- **Severity:** High · **File:** `actions/assistant.ts:26-44`
- **Reason:** User code/query concatenated into system prompt; client controls full `messages` incl. fake model turns.
- **Impact:** Assistant hijack → off-brand/harmful output.
- **Fix:** Use API system role; user content only in user turns; validate roles; cap turns; escape fences.
- **Effort:** S (4–6 h).

### H-7 · Server-side `new Function()` eval on request data
- **Severity:** High · **File:** `actions/ide.ts:75,118`; `actions/simulator.ts:88`
- **Reason:** Regex-gated eval in Node process; `actions/ide.ts` is dead but still exported/callable.
- **Impact:** One regex slip from RCE.
- **Fix:** Delete `actions/ide.ts`; replace with a real arithmetic parser or remove.
- **Effort:** S (3–4 h).

### H-8 · Unguarded notification fan-out (spam/phishing/DoS)
- **Severity:** High · **File:** `actions/notifications.ts:20-41,109-140`
- **Reason:** Exported actions write notifications to arbitrary users with client-supplied content/links; `triggerBypassCheck` loops all profiles in an XP range.
- **Impact:** Mass spam/phishing; DB write amplification.
- **Fix:** Make them internal (non-action) helpers; derive identity server-side; batch inserts; allowlist `link`.
- **Effort:** M (3–5 h).

### H-9 · No auto-grading → unbounded manual review backlog
- **Severity:** High · **File:** `actions/admin-problems.ts:47-60,268`; `actions/problems.ts`
- **Reason:** `expected_answer`/tolerance stored but never used; every submission manually reviewed.
- **Impact:** XP never awarded at scale → churn; admin overwhelmed.
- **Fix:** Implement server-side auto-grading against `expected_answer`/`answer_tolerance`/`answer_type`, or own a reviewed-with-SLA model.
- **Effort:** L (3–5 days).

### H-10 · Theme FOUC + hydration mismatch
- **Severity:** High (UX) · **File:** `components/providers/theme-provider.tsx:14-42`; `app/layout.tsx:56`
- **Reason:** Theme applied post-mount; no pre-paint script; no `suppressHydrationWarning`.
- **Impact:** Flash of wrong theme every load; hydration warning; CLS.
- **Fix:** Inline pre-hydration script in `<head>`; `suppressHydrationWarning` on `<html>`.
- **Effort:** S (2 h).

### H-11 · Quizzes inaccessible (buttons-not-radios)
- **Severity:** High (a11y) · **File:** `components/gamification/QuizWrapper.tsx:182-210`; `components/academy/quiz-player.tsx:119-138`
- **Reason:** No `radiogroup`/`aria-checked`/arrow-key nav.
- **Impact:** Keyboard/SR users cannot take quizzes — core feature inaccessible.
- **Fix:** Native radios or Radix RadioGroup.
- **Effort:** M (half day).

### H-12 · Pervasive contrast failures (gray-on-black)
- **Severity:** High (a11y) · **File:** `text-gray-500` (~151×), `text-gray-600` (~41×) across `dashboard-sidebar.tsx`, `site-header.tsx`, `(marketing)/page.tsx`, etc.
- **Reason:** 4.11:1 / 2.63:1 fail WCAG AA.
- **Impact:** Captions/nav/placeholders unreadable for low-vision users.
- **Fix:** Floor secondary text at `gray-400` (7.83:1); reserve dim grays for decoration.
- **Effort:** M (token sweep).

---

# Medium Issues

### M-1 · `createServiceClient()` fails open to anon key
- **File:** `lib/supabase/server.ts:31-38` · Missing key → `console.warn` + anon fallback instead of throw. **Fix:** throw. **Effort:** XS.

### M-2 · Fake terminal/simulator returns canned constants
- **File:** `actions/simulator.ts:39-135`; `components/simulator/terminal.tsx`, `console.tsx` · Educationally fraudulent. **Fix:** route through real webR or remove. **Effort:** M.

### M-3 · No pagination / over-fetch on lists
- **File:** `actions/community.ts:35-41`; `instructor/page.tsx:19-30`; `students/page.tsx:18,27-31` · **Fix:** `count: 'exact'` aggregates + `.range()` pagination + lazy replies. **Effort:** M (1 day).

### M-4 · `recalculate_user_level` write amplification
- **File:** `supabase_gamification_complete.sql:223-290` · Loops all courses per progress insert. **Fix:** incremental update or scheduled recompute. **Effort:** M.

### M-5 · Research section is static mock data shown as live
- **File:** `actions/research-articles.ts:4-65`; `actions/research.ts:23-79`; `research/[id]/page.tsx:71,104` · `getResearchPapers` silently returns fallback on any error. **Fix:** wire to DB or label as curated. **Effort:** M.

### M-6 · Per-attempt XP regrind (idempotency key includes attempt_id)
- **File:** `actions/admin-problems.ts:294` · Same problem re-earnable across attempts. **Fix:** key on `problem_{id}` per user. **Effort:** S.

### M-7 · Hand-rolled Markdown parser (libs already installed unused)
- **File:** `components/academy/lesson-content.tsx:11-64` · No inline formatting/links/math; index keys. **Fix:** use `react-markdown` + remark/rehype. **Effort:** M.

### M-8 · Dead non-functional `ui/select.tsx` + unused `command/popover`
- **File:** `components/ui/select.tsx:30-55` (returns null, business logic baked in, non-focusable trigger). **Fix:** delete or replace with native `<select>`. **Effort:** S.

### M-9 · No `prefers-reduced-motion`; infinite animations
- **File:** `globals.css` (none); `status-badge.tsx:35`, `enroll-button.tsx:155`, `XPProgressBar.tsx:194` · **Fix:** global reduced-motion media query. **Effort:** S.

### M-10 · `next/image` not configured for avatars; raw `<img>`/bg-image
- **File:** `next.config.mjs:4-11`; `dashboard-sidebar.tsx:189`; `LeaderboardWidget.tsx:185` · **Fix:** add Supabase host to `remotePatterns`; `next/image` + `onError`. **Effort:** S.

### M-11 · Touch targets <44px
- **File:** `ui/button.tsx:27`; `dashboard-sidebar.tsx:97-99`; `QuizWrapper.tsx:118-132` · **Fix:** pad to ≥44px. **Effort:** S.

### M-12 · `lib/queue.ts` no-op drops events
- **File:** `lib/queue.ts:22-47` · Fire-and-forget `console.log`; lost on serverless freeze. **Fix:** `waitUntil()` or QStash/DB. **Effort:** M.

### M-13 · Camera-optional + client-only anti-cheat theater
- **File:** `secure-arena-wrapper.tsx:81-164,339-347` · DevTools/copy/paste blocking trivially bypassed; F12 key-casing bug. **Fix:** server-side signals or remove. **Effort:** M.

### M-14 · WASM runtimes from third-party CDNs without SRI
- **File:** `components/simulator/ide.tsx:99` · Supply-chain risk. **Fix:** self-host or SRI/pin + CSP. **Effort:** M.

### M-15 · Raw DB error strings to client
- **File:** `actions/instructor.ts:22,39`; `community.ts:113,204`; `admin-problems.ts:79,102`; `app/error.tsx:30` · **Fix:** generic messages + server logging. **Effort:** S.

### M-16 · Unvalidated URLs (`pdf_url`/`dataset_url`) rendered as href
- **File:** `components/research/paper-card.tsx:82-88`; `actions/research.ts` · `javascript:` risk. **Fix:** require `https://`, validate. **Effort:** S.

---

# Low Issues

- **L-1 · Sidebar `xpData` fetched but never rendered** (`app/(dashboard)/layout.tsx:35` + `dashboard-sidebar.tsx:42`) — wasted blocking query. Render or remove. Effort S.
- **L-2 · Duplicate client auth round-trips** (`dashboard-topbar.tsx:27-36`, `site-header.tsx:23-38`) — pass user from server layout. Effort S.
- **L-3 · `error.tsx` not `global-error.tsx`** — root-layout errors uncaught; false "team notified." Effort S.
- **L-4 · Denormalized `author_role` stale** (`actions/community.ts:97-106`) — demoted users keep elevated badges. Effort S.
- **L-5 · Auto-submit drops empty solutions** (`secure-arena-wrapper.tsx:170-188`) while claiming submission. Effort S.
- **L-6 · `globals.css` 483-line `!important` war** — unmaintainable theming. Effort L.
- **L-7 · Stale-closure quiz timers** (`QuizWrapper.tsx:36-52`, `quiz-player.tsx:75-92`) behind `eslint-disable`. Effort S.
- **L-8 · Footer has no legal links** (`site-footer.tsx`). Add Privacy/Terms/Contact. Effort S.
- **L-9 · Verbose translate error leakage** (`actions/translate.ts:36-45` → `ide.tsx:246` alert). Effort S.
- **L-10 · Jargon copy sweep** (login/signup/dashboard) — plain language. Effort S–M.
- **L-11 · Repo hygiene** — `dump_profiles.js`, `scratch/`, `brain/`, `files/`, `project_context.txt` (873 KB), `lint.txt` in deployable tree. Remove/ignore; confirm no secrets. Effort S.
- **L-12 · `(arena)` layout lacks enrollment/role gate** (`app/(arena)/layout.tsx:9-14`) — any auth user reaches any problem. Effort S.
- **L-13 · Input range validation** on `createProblem` (`admin-problems.ts:62-87`) — bound `xp_reward`/`difficulty`. Effort S.

---

# Missing Features

- Real payment integration (gateway redirect + signed webhook + reconciliation + receipts/invoices).
- Auto-graded coding assessments (test cases, not manual review).
- Accessibility baseline (labels, radios, focus, reduced-motion, contrast) — required, not optional, for education.
- Pagination/infinite scroll on community, leaderboard, students, submissions.
- Onboarding / first-lesson guided flow.
- Search (courses, lessons, community, research).
- Content moderation for community + research submissions.
- Retention mechanics: email/push nudges, streak freeze, daily goals, leagues.
- Real analytics for learners and instructors (not hardcoded panels).
- Legal pages (Privacy, Terms, Refund) — mandatory for paid Bangladeshi fintech flows.
- Error monitoring (Sentry) + structured logging.
- Rate limiting layer.
- A real migration tool / single schema source of truth.

---

# Features To Remove

- Fake payment wizard (`components/academy/enroll-button.tsx` PIN/OTP flow).
- Fake terminal/simulator constants (`actions/simulator.ts`, `components/simulator/terminal.tsx`).
- Fake skill tree (`components/academy/skill-tree.tsx`) until backed by data.
- Fake "System Health" panel and hardcoded marketing/leaderboard stats.
- `@tensorflow/tfjs` dependency (unused).
- `actions/ide.ts` (dead, RCE-adjacent), `lib/queue.ts` (no-op), `components/ui/{select,command,popover}.tsx` (dead).
- Community `new Function()` runner (or sandbox it).
- DevTools/key-block "security theater" in the arena wrapper.

---

# Features To Redesign

- **Auth/authorization:** middleware + DB role model; kill the hardcoded email.
- **Arena attempt + grading model:** one coherent policy, DB-enforced, auto-graded.
- **Gamification levels:** a comprehensible, cheap-to-compute definition.
- **Theming/CSS:** variable-driven, no `* !important`; fix FOUC.
- **Voice/UX:** learner-first plain language with optional light gamified flavor.
- **Quiz UI:** accessible radiogroup with server-scored submission (already server-scored — just fix the UI).

---

# Scalability Risks

1. Unbounded list queries (community feed + nested replies, instructor dashboards) — fail first.
2. `recalculate_user_level()` per-progress-insert write amplification.
3. Per-navigation gamification queries in the dashboard layout.
4. Manual arena grading backlog (no auto-grade).
5. No queue (events dropped) → no reliable analytics/telemetry at scale.
6. AI denial-of-wallet with no rate limiting.
7. No pagination on leaderboard/students/submissions.
8. Schema not reproducible (multi-file SQL, no ordered migrations) → risky scaling/ops.

---

# Security Risks

(See **Security Score** + **Critical/High** sections — CR-1…CR-6, H-1…H-8 are the security set.) Top five: payment callback forgery (CR-1), fake PIN-harvesting payment (CR-2), claimable hardcoded admin (CR-3), AI denial-of-wallet (CR-4), community RCE/XSS (CR-5). Plus no middleware (H-1), PII leak (H-2), client-trusted integrity (H-5), service-role-everywhere (RLS dead, no defense-in-depth).

---

# Technical Debt

- Triple/quadruple overlapping SQL sources, no migration tool.
- Service-role client used for ordinary reads/writes → RLS is decorative.
- Hand-rolled parsers/components duplicating installed libraries.
- 55% client components; gratuitous `"use client"`.
- `globals.css` `!important` war; brittle light mode.
- Dead code (`ide.ts`, `select.tsx`, `command/popover`, `queue.ts`) and committed scratch/dump files (`files/`, `scratch/`, `brain/`, `project_context.txt`).
- `eslint-disable` papering over real hook bugs.
- Mock data wired to production UI (debt that actively lies to users).

---

# World-Class Improvements

1. Real gateway + signed webhooks + reconciliation; receipts; refund flow.
2. Server-side auto-grading with hidden test cases; instant feedback loop.
3. WCAG 2.2 AA pass; accessible quiz radiogroups; reduced-motion; contrast tokens.
4. `middleware.ts` auth gate + DB role model + RLS actually enforced (drop service-role default).
5. Rate limiting (Upstash) + AI system-role separation + cost dashboards.
6. Pagination + caching/ISR + a real durable queue (`waitUntil`/QStash).
7. Learner-first voice; guided onboarding; streak/league retention loops backed by real notifications.
8. Single migration source (Supabase CLI) + seed separation + CI that runs them.
9. Honest proctoring: real detection + stored evidence, or remove the claim.
10. Convert gratuitous client components to server components; drop tfjs/dead deps; ship the markdown libs you already installed.

---

# Launch Readiness

**NOT READY.** Hard blockers before any public/paid launch:
- CR-1 payment callback forgery
- CR-2 fake PIN-harvesting payment
- CR-3 hardcoded/claimable admin
- CR-4 AI denial-of-wallet
- CR-5 community RCE/XSS
- CR-6 fake proctoring claims (legal)
- H-2 student PII leak
- H-1 no middleware

Minimum-viable-beta also requires: H-9 (grading or honest SLA), H-11/H-12 (quiz a11y + contrast), M-3 (pagination), and removal/relabeling of all fake subsystems. Realistic remediation to a credible beta: **4–8 focused engineer-weeks**, dominated by real payment integration and the security pass.

---

# Final Verdict

INSYT Academy is a **prototype wearing a product's clothes**. There is real substance underneath — sector-personalized lessons, an idempotent XP engine, server-scored quizzes, a genuine WASM IDE — and a strong visual identity. But the three pillars a user must trust (pay, be fairly assessed, run real code) are **faked**, and the security posture is **disqualifying**: a claimable hardcoded admin, a forgeable payment callback, a PIN-harvesting checkout, an open AI wallet, and a browser RCE in the community feed. Accessibility is effectively absent, which for an education product is its own launch blocker.

Do not launch. Run the P0 security/trust remediation, delete or honestly relabel every fake subsystem, and do an accessibility + scale pass. The bones are good enough that this is salvageable — but shipping it as-is to "millions of users" would be a security incident and a trust catastrophe waiting to happen.

**Overall: 41/100. Verdict: REBUILD THE TRUST-CRITICAL PATHS, THEN RE-REVIEW.**
