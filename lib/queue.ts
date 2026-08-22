import { createServiceClient } from "@/lib/supabase/server";

export interface QueueEvent {
    id: string;
    type: "QUIZ_SUBMIT" | "ENROLL_TRIGGER" | "PROGRESS_UPDATE";
    payload: Record<string, unknown>;
    timestamp: number;
}

/**
 * Durable, serverless-safe event dispatcher.
 *
 * The previous implementation only console.log'd inside an un-awaited Promise,
 * so events were silently lost when the serverless function froze. This version
 * persists each event to the `analytics_events` table via the service client and
 * AWAITS the write, so callers should `await dispatch(...)` to guarantee delivery.
 * The write is best-effort: failures are logged but never throw into the caller.
 */
class EventQueue {
    public async dispatch(
        type: QueueEvent["type"],
        payload: Record<string, unknown>
    ): Promise<string> {
        const id = `EVT_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        try {
            const db = createServiceClient();
            await db.from("analytics_events").insert({
                event_type: type,
                payload,
                created_at: new Date().toISOString(),
            });
        } catch (err) {
            // Never break the calling action because telemetry failed.
            console.error(`[EventQueue] Failed to persist event ${id} (${type}):`, err);
        }
        return id;
    }
}

export const eventQueue = new EventQueue();
