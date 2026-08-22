# INSYT Academy — Final Deployment Checklist

Status after the 8-phase remediation. All 6 Critical and 12 High audit issues are
resolved; `tsc --noEmit`, `next lint --max-warnings=0`, and `next build` all pass.
This document is the pre-launch gate. Work top to bottom.

> **Golden rule:** the payment gateway and LLM gateway run in **mock mode** whenever
> credentials are placeholders. Mock payments are **blocked in production** (the gateway
> throws). So production *will not start the paid flow* until real bKash creds are set.

---

## 1. Remaining Unresolved Issues

These were intentionally deferred (low severity / high risk / external dependency).
None are launch-blocking, but track them.

| ID | Issue | Why deferred | Recommended action |
|----|-------|--------------|--------------------|
| L-6 | `app/globals.css` is a ~480-line `!important` / universal-selector theme system | Rewriting late risks destabilizing both themes | Refactor to CSS-variable-driven theming post-launch |
| L-2 | `dashboard-topbar.tsx` / `site-header.tsx` re-fetch the session client-side | Moderate refactor, cosmetic latency only | Pass `user` from the server layout as props |
| M-14 | Pyodide/webR WASM loaded from public CDNs without SRI | Needs self-hosting or proxy + CSP | Self-host runtimes or add SRI + a `script-src` CSP |
| L-4 | `community_posts.author_role` is denormalized (can go stale on demotion) | Low impact | Join live `profiles.role` at read time |
| — | `lib/rate-limit.ts` is **in-memory (per instance)** | Works for single instance / serverless warm | Move to Upstash Redis before horizontal scaling |
| — | Input validation is manual (no Zod) | Zod not installable in the build env | Optionally adopt Zod schemas in `actions/*` |
| P8 | Onboarding, content moderation, retention emails, real learner/instructor analytics, Sentry, Supabase-CLI migration consolidation | Multi-week; need external accounts + product decisions | Schedule as post-beta epics |
| — | `lib/queue.ts` now persists to `analytics_events`, but nothing **consumes** it yet | No dashboard built | Build an analytics reader or pipe to a warehouse |
| — | Arena auto-grading grades a typed **answer**; full code execution is not auto-run | Server-side code execution is itself an RCE risk | Keep answer-grading; add sandboxed test-runner later if needed |

**Known product caveat:** the `(arena)` route group gates on authentication only (arena
problems are globally published, not per-course). Confirm this matches intent.

---

## 2. Remaining Manual Steps (in order)

1. **Set all environment variables** (Section 3) in the hosting provider.
2. **Run all Supabase migrations** in order (Section 4).
3. **Seed the admin account** — edit `supabase/migration_phase3_security.sql` so the
   correct account email is granted `role = 'admin'` (it currently seeds the
   previously-hardcoded `z65gt9@gmail.com`). Re-run that file if you change it.
4. **Populate `course_pricing`** for every paid course (`is_free = false`, `price_bdt`).
   Courses with no pricing row are treated as **free**.
5. **Replace placeholder contact/legal content** — emails in
   `app/(marketing)/contact/page.tsx` and the placeholder text in
   `privacy` / `terms` / `refund` pages must be reviewed by counsel and made real.
6. **Provision real bKash credentials** (Section 7) — until then, production refuses
   to process payments.
7. **Provision a DeepSeek API key** (Section 6) — otherwise the assistant returns
   clearly-labelled `[MOCK]` responses.
8. **Confirm secrets are not in VCS** — `dump_profiles.js`, `scratch/`, `brain/`,
   `files/`, `project_context.txt` are now git-ignored; verify they were never committed
   (`git log --all -- dump_profiles.js`). Rotate the service-role key if in doubt.
9. **Smoke-test** auth redirects, a paid enrollment (mock + live), an AI prompt, a
   community code run, and an arena submission.

---

## 3. Required Environment Variables

Set these in the host (Vercel project settings, or `.env.local` for self-host).

### Supabase (required)
| Var | Notes |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret.** Server-only. `createServiceClient()` now **throws** if missing — required for payments, XP, notifications, analytics |

### DeepSeek LLM (required for live AI; mock otherwise)
| Var | Default | Notes |
|-----|---------|-------|
| `DEEPSEEK_API_KEY` | — | Placeholder/empty → mock mode |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | Optional override |
| `DEEPSEEK_MODEL` | `deepseek-chat` | Optional override |

### bKash payments (required for live; mock in non-prod, blocked in prod if missing)
| Var | Default | Notes |
|-----|---------|-------|
| `BKASH_APP_KEY` | — | From bKash merchant portal |
| `BKASH_APP_SECRET` | — | Secret |
| `BKASH_USERNAME` | — | Secret |
| `BKASH_PASSWORD` | — | Secret |
| `BKASH_BASE_URL` | `https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized` | Use the **live** base URL for production |

### Optional
| Var | Notes |
|-----|-------|
| `FEATURE_FLAGS` | JSON, e.g. `{"skillTree":true}`. Defaults: skillTree, systemHealth, researchAnalytics, advancedAnalytics all `false` |
| `NODE_ENV` | `production` enforces real payments (no mock fallback) |

> Placeholder detection treats values containing `your_`, `placeholder`, `changeme`,
> `xxx`, or empty as "not set" → mock mode (payments throw in prod, LLM mocks anywhere).

---

## 4. Required Supabase Migrations

Apply **in this exact order** (full reference: `supabase/MIGRATIONS.md`). SQL editor or `psql`.

1. `supabase/schema.sql`
2. `supabase/migration_phase1.sql` — payments tables
3. `supabase/migration_phase2.sql` — research / b2b
4. `supabase_gamification_complete.sql` — XP engine, problems
5. `supabase_arena_patch.sql` — arena attempt limits
6. `supabase/migration_phase3_security.sql` — **role normalization, admin seed, proctoring-column drop, case-insensitive role RLS, courses write policies**
7. `supabase/migration_phase4_community.sql` — `post_votes` + `add_upvote` RPC + upvote RLS fix
8. `supabase/migration_phase5_perf.sql` — set-based `recalculate_user_level`
9. `supabase/migration_phase6_analytics.sql` — `analytics_events` table
10. `supabase/seeds/*.sql` — optional course seed data

**Post-migration verification**
- [ ] `select role, count(*) from profiles group by role;` → only `admin`/`instructor`/`student`.
- [ ] Your admin account shows `role = 'admin'`.
- [ ] `problem_attempts` has **no** `proctoring_active` / `violation_count` columns.
- [ ] `post_votes` table and `add_upvote` function exist.
- [ ] `analytics_events` table exists.

---

## 5. Required Cloudflare Setup

The app is a Next.js (App Router) deployment with Supabase. Cloudflare is **optional**
but recommended as the edge layer. If you front the app with Cloudflare:

- [ ] **DNS** — proxied (orange-cloud) record pointing to the host (Vercel/origin).
- [ ] **SSL/TLS** — mode **Full (strict)**; enable Always Use HTTPS + HSTS.
- [ ] **WAF** — enable Managed Ruleset; add a rate-limiting rule on
      `/api/payment/*` and the AI server actions (defense-in-depth on top of the
      app-level `lib/rate-limit.ts`).
- [ ] **Bot Fight Mode / Turnstile** on `/login`, `/signup` to curb credential stuffing.
- [ ] **Caching** — do **not** cache `/api/*`, authenticated dashboard routes, or
      Server Actions. Cache static assets (`/_next/static/*`) aggressively.
- [ ] **Do not** put Cloudflare's cache in front of `/api/payment/callback` (must hit origin).
- [ ] If using Cloudflare Workers/Pages instead of Vercel: confirm `middleware.ts`
      (Edge runtime) and Node server actions are supported by the chosen adapter.

> If you are **not** using Cloudflare, ensure the host provides equivalent TLS,
> HSTS, and edge rate-limiting — and that app-level rate limiting is backed by a
> shared store (Redis) once running more than one instance.

---

## 6. Required DeepSeek Setup

- [ ] Create a DeepSeek account and generate an API key.
- [ ] Set `DEEPSEEK_API_KEY` (and optionally `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL`).
- [ ] Confirm startup log reads `[LLMGateway] Initialized in LIVE mode (DeepSeek)`.
- [ ] Set a **billing cap / usage alert** in the DeepSeek dashboard (app rate-limits
      to 20 req/user/min, but a budget ceiling is still recommended).
- [ ] Verify the assistant no longer prefixes replies with `[MOCK AI ...]`.
- [ ] Sanity-check prompt-injection resistance: code containing
      "ignore previous instructions" must not change assistant behavior.

---

## 7. Required Payment Gateway Setup (bKash)

- [ ] Obtain **production** bKash Tokenized Checkout credentials (app key/secret,
      username, password) from the bKash merchant portal.
- [ ] Set `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD`.
- [ ] Set `BKASH_BASE_URL` to the **live** tokenized base URL (not sandbox).
- [ ] Register the callback/redirect URL with bKash:
      `https://<your-domain>/api/payment/callback`.
- [ ] Confirm startup log reads `[PaymentGateway] Initialized in LIVE mode (bKash)`.
- [ ] Verify `course_pricing` rows exist for all paid courses.
- [ ] **End-to-end test**: initialize → bKash hosted page → return → callback
      `execute` confirms `Completed` → transaction `SUCCESS` → enrollment created.
- [ ] **Negative test**: forge a callback POST with a fake/foreign `orderId` →
      must be rejected (no enrollment). Amount-mismatch → marked `FAILED`.
- [ ] Confirm the in-app dev mock checkout (`/academy/checkout/sandbox`) is
      unreachable/irrelevant in production (mock provider is disabled in prod).
- [ ] Reconciliation: decide how `PENDING` transactions that never complete are aged out.

---

## 8. Production Deployment Checklist

### Pre-deploy
- [ ] All env vars set (Section 3); secrets stored as encrypted host secrets, not in repo.
- [ ] All migrations applied and verified (Section 4).
- [ ] Admin account seeded and MFA-enabled on the Supabase auth user.
- [ ] `course_pricing` populated; free vs paid intent confirmed.
- [ ] Legal pages + contact emails finalized by counsel.
- [ ] bKash live creds + callback URL registered (Section 7).
- [ ] DeepSeek key + billing cap set (Section 6).
- [ ] `.gitignore` covers `scratch/`, `brain/`, `files/`, `dump_profiles.js`,
      `project_context.txt`; confirm no secrets in git history; rotate keys if unsure.

### Build & verify
- [ ] `npm install` (lockfile updated after dependency removals: tfjs, cmdk, radix-popover).
- [ ] `npm run lint` → 0 warnings.
- [ ] `npm run build` → succeeds.
- [ ] Startup logs show **LIVE** mode for both PaymentGateway and LLMGateway.

### Smoke tests (production)
- [ ] Unauthenticated user hitting `/academy`, `/instructor`, `/admin` → redirected to `/login`.
- [ ] Non-admin hitting `/admin` → redirected to `/academy`; non-instructor hitting
      `/instructor/students` → redirected (no PII leak).
- [ ] Sign up → email confirm → log in → land on dashboard.
- [ ] Free course → "Enroll Now" enrolls instantly.
- [ ] Paid course → redirects to bKash → success creates enrollment; failure does not.
- [ ] AI assistant returns real (non-mock) responses; rate limit triggers after burst.
- [ ] Community "Run" executes JS in the sandbox (no page-context access); R/Python
      shows the "use the IDE" message.
- [ ] Arena: submit a correct answer → instant XP; daily 5-attempt limit enforced.
- [ ] Quiz is keyboard- and screen-reader-navigable (radiogroup).
- [ ] Theme has no flash on load (FOUC fix); `prefers-reduced-motion` honored.
- [ ] Upvoting a post twice does not double-count.

### Post-deploy monitoring
- [ ] Watch logs for `[PaymentGateway]` / `[LLMGateway]` errors and callback rejections.
- [ ] Monitor DeepSeek spend and Supabase row growth (`analytics_events`, `transactions`).
- [ ] Wire a real error reporter (Sentry) into `app/error.tsx` / `app/global-error.tsx`
      (currently `console.error` only).
- [ ] Schedule the deferred items in Section 1.

---

### Sign-off
- [ ] Engineering — build, migrations, env verified
- [ ] Security — auth/role gating, payment callback, no leaked secrets
- [ ] Legal — privacy/terms/refund, payment compliance (bKash/Bangladesh Bank)
- [ ] Product — pricing, copy, feature flags

**Do not enable live payments to real users until every box in Sections 2, 4, 7, and 8 is checked.**
