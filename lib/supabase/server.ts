import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}

export function createServiceClient() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
        // Fail closed. Silently falling back to the anon key (previous behavior)
        // would make privileged server operations quietly stop working — or worse,
        // appear to work while writing under restricted RLS.
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing — service client unavailable.");
    }
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        {
            cookies: {
                getAll() {
                    return [];
                },
                setAll() {
                    // No-op: service client doesn't need cookie management
                },
            },
        }
    );
}

