// lib/notifications.ts
// SERVER-ONLY internal helpers. These are intentionally NOT server actions
// ("use server"), so the browser cannot invoke them directly with arbitrary
// arguments — closing the spam/phishing/DoS fan-out hole (audit H-8).
//
// Only trusted server code (other actions) may import and call these.

import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_TYPES = new Set(["course", "leaderboard", "social", "research", "system"]);

/** Internal links only — reject absolute/external URLs (anti-phishing). */
function safeLink(link?: string): string | null {
  if (!link) return null;
  if (!link.startsWith("/") || link.startsWith("//")) return null;
  return link;
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) {
  const safeType = ALLOWED_TYPES.has(type) ? type : "system";
  try {
    const admin = createAdminClient();
    await admin.from("notifications").insert({
      user_id: userId,
      title: String(title).slice(0, 200),
      message: String(message).slice(0, 1000),
      type: safeType,
      link: safeLink(link),
      is_read: false,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Failed to insert notification:", e);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function triggerBypassCheck(..._args: unknown[]) {
  // Gamification XP bypasses deprecated
  return;
}

