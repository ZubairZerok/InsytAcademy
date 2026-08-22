import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Obsidian Palette — Deep organic tones, not pure black
        "agri-black": "var(--agri-black)",
        "agri-dark": "var(--agri-dark)",
        "agri-deep": "var(--agri-deep)",
        // Primary Accent — Bio-luminescent green (theme adaptive)
        "neon-green": "var(--neon-green)",
        "neon-green-dim": "var(--neon-green-dim)",
        "neon-green-muted": "var(--neon-green-muted)",
        // Surface & Border
        "cyber-gray": "var(--cyber-gray)",
        "cyber-gray-light": "var(--cyber-gray-light)",
        "surface-glass": "var(--surface-glass)",
        // Semantic
        "alert-red": "#FF4D4D",
        "alert-amber": "#FFAA00",
        "info-cyan": "#00D4FF",
        // Payment Gateway Colors
        "bkash-pink": "#E2136E",
        "nagad-orange": "#F26522",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-lg": "0 16px 64px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-organic": "linear-gradient(135deg, #070A08 0%, #0D1410 50%, #111916 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(0, 255, 148, 0.03) 0%, rgba(0, 0, 0, 0) 100%)",
        "gradient-hero": "linear-gradient(180deg, #070A08 0%, #0D1410 40%, rgba(0, 255, 148, 0.02) 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-up": "fade-up 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) => {
      addUtilities({
        ".glass": {
          background: "rgba(13, 20, 16, 0.6)",
          "backdrop-filter": "blur(16px)",
          "-webkit-backdrop-filter": "blur(16px)",
          border: "1px solid rgba(0, 255, 148, 0.08)",
        },
        ".glass-strong": {
          background: "rgba(13, 20, 16, 0.85)",
          "backdrop-filter": "blur(24px)",
          "-webkit-backdrop-filter": "blur(24px)",
          border: "1px solid rgba(0, 255, 148, 0.12)",
        },
        ".text-glow": {
          // text-glow intentionally left as a no-op so existing classnames don't break build
          "letter-spacing": "inherit",
        },
        ".glow-border": {
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        ".glow-border:hover": {
          "border-color": "rgba(255, 255, 255, 0.2)",
        },
      });
    },
  ],
};
export default config;
