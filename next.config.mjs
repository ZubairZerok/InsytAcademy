/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    transpilePackages: ["tailwind-merge"],
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "upload.wikimedia.org",
            },
            {
                protocol: "https",
                hostname: "**.supabase.co",
            },
        ],
    },
};

export default nextConfig;
