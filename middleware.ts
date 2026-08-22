import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Edge middleware
// ---------------------------------------------------------------------------
// Two jobs:
//   1. Refresh the Supabase auth session on every request (keeps SSR cookies
//      fresh — lib/supabase/server.ts assumed this existed but it did not).
//   2. Defense-in-depth route gating: unauthenticated users are bounced from
//      app areas; /admin requires the admin role and /instructor requires
//      instructor|admin. Page-level guards (lib/auth/assert-role.ts) remain as
//      the authoritative check; this is a second layer.
//
// Public routes (/, /login, /signup, /api/payment/callback, static assets) are
// excluded via the matcher below.

const AUTH_REQUIRED_PREFIXES = [
  "/academy",
  "/instructor",
  "/admin",
  "/leaderboard",
  "/community",
  "/research",
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const needsAuth = AUTH_REQUIRED_PREFIXES.some((p) => path.startsWith(p));

  if (!user && needsAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Only allow same-origin relative paths as redirect targets (prevent open redirect)
    const rawRedirect = path;
    const safeRedirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/academy";
    url.searchParams.set("redirect", safeRedirect);
    return NextResponse.redirect(url);
  }

  // Role gating only needs a DB read for the two privileged areas.
  if (user && (path.startsWith("/admin") || path.startsWith("/instructor"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = (profile?.role ?? "").toLowerCase();

    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/academy", request.url));
    }
    if (
      path.startsWith("/instructor") &&
      role !== "admin" &&
      role !== "instructor"
    ) {
      return NextResponse.redirect(new URL("/academy", request.url));
    }
  }

  return response;
}

export const config = {
  // Run on everything EXCEPT: api routes, Next internals, auth pages, password
  // reset pages, auth callbacks, and static assets.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|forgot-password|update-password|reset-password|auth|.*\\..*).*)",
  ],
};
