// lib/auth/assert-role.ts
// Centralized, server-only authorization helpers.
//
// Replaces the hardcoded super-admin email check (z65gt9@gmail.com) that was
// previously scattered across server actions, pages, AND the client bundle.
// Admin/instructor status is now derived exclusively from `profiles.role`,
// verified server-side via the authenticated (RLS-respecting) Supabase client.
//
// Two flavors are provided:
//   - assert*()  -> THROW on failure. Use inside server actions (try/catch).
//   - require*() -> REDIRECT on failure. Use at the top of server pages/layouts.
//
// Role casing is normalized: the DB historically used 'Admin'/'Cadet'/etc.
// We treat roles case-insensitively and collapse anything unknown to 'student'.

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export type AppRole = "admin" | "instructor" | "student";

/** Collapse any DB role string into a known AppRole (case-insensitive). */
export function normalizeRole(raw?: string | null): AppRole {
  const r = (raw ?? "").trim().toLowerCase();
  if (r === "admin") return "admin";
  if (r === "instructor") return "instructor";
  return "student";
}

/** True if the role is allowed to use instructor/admin tooling. */
export function isStaffRole(role: AppRole): boolean {
  return role === "admin" || role === "instructor";
}

export interface SessionWithRole {
  user: User | null;
  role: AppRole | null;
}

/**
 * Fetch the current user and their normalized role.
 * Non-throwing; returns nulls when unauthenticated. Use for conditional UI.
 */
export async function getSessionWithRole(): Promise<SessionWithRole> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, role: normalizeRole(profile?.role) };
}

// ---------------------------------------------------------------------------
// Throwing variants — for server actions
// ---------------------------------------------------------------------------

export async function assertAuthenticated(): Promise<User> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");
  return user;
}

/** Admin OR instructor. Use for course/problem authoring tools. */
export async function assertInstructor(): Promise<User> {
  const { user, role } = await getSessionWithRole();
  if (!user) throw new Error("Unauthenticated");
  if (role !== "admin" && role !== "instructor") {
    throw new Error("Forbidden: insufficient role");
  }
  return user;
}

/** Admin only. Use for platform administration. */
export async function assertAdmin(): Promise<User> {
  const { user, role } = await getSessionWithRole();
  if (!user) throw new Error("Unauthenticated");
  if (role !== "admin") {
    throw new Error("Forbidden: insufficient role");
  }
  return user;
}

// ---------------------------------------------------------------------------
// Redirecting variants — for server pages / layouts
// ---------------------------------------------------------------------------

export async function requireAuthenticated(
  redirectTo = "/login"
): Promise<User> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(redirectTo);
  return user;
}

export async function requireInstructor(
  redirectTo = "/academy"
): Promise<User> {
  const { user, role } = await getSessionWithRole();
  if (!user) redirect("/login");
  if (role !== "admin" && role !== "instructor") redirect(redirectTo);
  return user;
}

export async function requireAdmin(redirectTo = "/academy"): Promise<User> {
  const { user, role } = await getSessionWithRole();
  if (!user) redirect("/login");
  if (role !== "admin") redirect(redirectTo);
  return user;
}
