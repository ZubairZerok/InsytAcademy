import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "INSYT Academy — The Future of Agricultural & Biotech Education",
    template: "%s | INSYT Academy",
  },
  description:
    "Master Agriculture, Bioinformatics, Livestock Science, Forestry, and Biotech Engineering with interactive labs, real research tools, and industry-recognized certifications. The world's most advanced agri-science learning ecosystem.",
  keywords: [
    "agriculture courses",
    "bioinformatics training",
    "livestock science",
    "forestry education",
    "biotech engineering",
    "veterinary science",
    "agri-tech",
    "online learning",
    "research education",
    "LMS",
    "INSYT Academy",
  ],
  authors: [{ name: "INSYT Academy" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "INSYT Academy",
    title: "INSYT Academy — The Future of Agricultural & Biotech Education",
    description:
      "Master Agriculture, Bioinformatics, and Biotech with interactive labs and industry certifications.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "INSYT Academy — Agricultural & Biotech Learning Ecosystem",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "INSYT Academy",
    description:
      "The world's most advanced agri-science learning ecosystem.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        {/* Apply the saved/preferred theme BEFORE paint to avoid a flash of the
            wrong theme (FOUC) and the hydration mismatch it caused. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('insyt-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-agri-black font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
