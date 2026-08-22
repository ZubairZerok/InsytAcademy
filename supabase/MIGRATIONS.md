# Database Migrations — Run Order

Apply these SQL files **in order** against the Supabase project (SQL editor or
`psql`). Each is idempotent where practical, but order matters because later
files depend on tables/columns created earlier.

| # | File | Purpose |
|---|------|---------|
| 1 | `schema.sql` | Core tables (profiles, courses, modules, lessons, enrollments, quizzes, certificates, community) + base RLS |
| 2 | `migration_phase1.sql` | Payments: `course_pricing`, `transactions`, `instructor_wallets`, `course_reviews` |
| 3 | `migration_phase2.sql` | `research_papers`, `b2b_organizations` |
| 4 | `../supabase_gamification_complete.sql` | XP engine: `xp_events`, quizzes, submissions, leaderboard cache, `award_xp`, streaks, problems/attempts |
| 5 | `../supabase_arena_patch.sql` | Arena attempt-limit adjustments |
| 6 | `migration_phase3_security.sql` | **Security remediation**: normalize `profiles.role`, seed admin, drop proctoring columns, case-insensitive role RLS, courses write policies |
| 7 | `migration_phase4_community.sql` | `post_votes` + `add_upvote` RPC + fix tautological upvote policy |
| 8 | `migration_phase5_perf.sql` | Set-based `recalculate_user_level` |
| 9 | `migration_phase6_analytics.sql` | `analytics_events` (durable event log) |
| 10 | `seeds/*.sql` | Optional course seed data |

## Notes
- Step 6 seeds the initial admin from the email previously hardcoded in source
  (`z65gt9@gmail.com`). Edit that file to grant admin to the correct account(s).
- After step 6, roles are canonical lowercase: `admin` / `instructor` / `student`.
- These files are not yet under the Supabase CLI migration runner. Migrating them
  into timestamped CLI migrations (so CI can apply them automatically) is the
  remaining consolidation task.
