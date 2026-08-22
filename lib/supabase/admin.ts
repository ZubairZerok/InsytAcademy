// lib/supabase/admin.ts
// Creates a Supabase client using the SERVICE ROLE KEY.
//
// ⚠️  CRITICAL SECURITY RULES:
//   1. ONLY import this in Server Components, Server Actions, or Route Handlers.
//   2. NEVER import in client components (no 'use client' files).
//   3. NEVER pass the admin client or its result to the browser.
//   4. The service role key bypasses ALL RLS — treat it like a DB superuser.

import { createClient as _createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars'
    )
  }

  return _createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  })
}
