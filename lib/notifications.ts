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

/**
 * When a user gains XP and overtakes others, notify the overtaken users.
 * Identity/XP are supplied by trusted server code (progress.ts), never the client.
 */
export async function triggerBypassCheck(
  activeUserId: string,
  activeUserName: string,
  oldXP: number,
  newXP: number
) {
  if (!Number.isFinite(oldXP) || !Number.isFinite(newXP) || newXP <= oldXP) return;
  try {
    const admin = createAdminClient();
    const { data: bypassed } = await admin
      .from("profiles")
      .select("id, total_xp")
      .neq("id", activeUserId)
      .gte("total_xp", oldXP)
      .lt("total_xp", newXP)
      .limit(50);

    if (!bypassed || bypassed.length === 0) return;

    const safeName = String(activeUserName).slice(0, 80);
    const rows = bypassed.map((p) => ({
      user_id: p.id,
      title: "⚡ Leaderboard Alert",
      message: `${safeName} just overtook you on the leaderboard. Keep learning to reclaim your rank!`,
      type: "leaderboard",
      link: "/leaderboard",
      is_read: false,
      created_at: new Date().toISOString(),
    }));

    // Single batched insert instead of N sequential round-trips.
    await admin.from("notifications").insert(rows);
  } catch (e) {
    console.error("Leaderboard bypass check failed:", e);
  }
}
