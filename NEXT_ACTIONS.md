# Next Actions for Free Public Beta Deployment

Since you are deploying a **free public beta** without paid integrations (No bKash, No DeepSeek, No Sentry, No Redis, No QStash, No Paid Cloudflare, No AI Proctoring), follow this exact execution order:

### 1. Database & Schema Verification
- [ ] Run the **`gamification_repair.sql`** script in your Supabase SQL Editor. This will fix the missing courses, restore the gamification engine (XP, streaks, leveling), and ensure the progress tracking works perfectly.
- [ ] Ensure that `profiles.role` for your account (`z65gt9@gmail.com`) is set to `admin`.

### 2. Environment Variables Setup (Vercel/Hosting)
Set the following in your hosting provider. Since you don't have paid APIs yet, leaving the LLM/Payment keys empty will automatically trigger the built-in **Mock Mode** so the app doesn't crash.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase Anon Key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase Service Role Key (Required for XP and progress tracking)
- [ ] `DEEPSEEK_API_KEY` = *(Leave blank or placeholder to enable Mock AI Mode)*
- [ ] `BKASH_APP_KEY` = *(Leave blank or placeholder to enable Mock Payment Mode)*
- [ ] `NODE_ENV` = `production`

### 3. Application Configuration
- [ ] Edit `app/(marketing)/contact/page.tsx` and replace placeholder emails with `z65gt9@gmail.com`.
- [ ] Edit the content in your privacy/terms/refund pages to reflect your beta status and use `z65gt9@gmail.com` for contact info.

### 4. Build & Deploy
- [ ] Push all your latest changes (including the removed proctoring code and gamification fixes) to GitHub.
- [ ] Deploy the project on Vercel (or your chosen host).
- [ ] Monitor the build logs to ensure `npm run build` succeeds without errors.

### 5. Final Smoke Test (Live Deployment)
- [ ] Create a test account on the live URL.
- [ ] Enroll in a free course.
- [ ] Complete a lesson and verify that XP is awarded, the dashboard updates, and the next lesson unlocks.
- [ ] Test the AI Assistant (it should clearly show it is in `[MOCK]` mode).
