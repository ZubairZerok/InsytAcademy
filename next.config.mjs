/** @type {import('next').NextConfig} */
const nextConfig = {
    // Hide X-Powered-By header (don't advertise Next.js version)
    poweredByHeader: false,
    transpilePackages: ["tailwind-merge"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "upload.wikimedia.org",
            },
            {
                // Supabase Storage (avatars, thumbnails). Covers <project-ref>.supabase.co.
                protocol: "https",
                hostname: "**.supabase.co",
            },
        ],
    },
    async headers() {
        return [
            {
                // Apply security headers to page routes (exclude Next internal static assets)
                source: "/((?!_next/static|_next/image|favicon.ico).*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
