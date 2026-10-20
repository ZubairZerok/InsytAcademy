import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** Only allow relative paths starting with a single `/` — blocks `//evil.com` open redirect. */
function sanitizeRedirect(next: string | null): string {
    const fallback = "/academy";
    if (!next) return fallback;
    // Must start with "/" and must NOT start with "//" (protocol-relative URL)
    if (!next.startsWith("/") || next.startsWith("//")) return fallback;
    return next;
}

export async function GET(request: Request) {
    // The `request` object gives us access to the URL and query parameters
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // Sanitize "next" param to prevent open redirect
    const next = sanitizeRedirect(searchParams.get("next"));

    if (code) {
        const supabase = createClient();
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // If successful, redirect to the next page
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

