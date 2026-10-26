import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F7F5F0",
          50: "#FCFBF9",
          100: "#F7F5F0",
          200: "#EFECE3",
          300: "#E3DDD0",
        },
        ink: {
          DEFAULT: "#0E1A24",
          50: "#22394E",
          100: "#1B2F40",
          200: "#162635",
          300: "#121F2B",
          900: "#0E1A24",
          950: "#080F16",
        },
        aqua: {
          DEFAULT: "#CFE8E4",
          light: "#E5F4F1",
          soft: "#D7ECE9",
          dark: "#A3D4CD",
        },
        electric: {
          teal: "#12B5A6",
          hover: "#0E9E91",
          light: "#E1FAF6",
        },
        sand: {
          DEFAULT: "#E8DCC8",
          light: "#F2EBDE",
          dark: "#DAC7AD",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Instrument Serif", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Geist", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem", // 32px as specified in blueprint
        "5xl": "2.5rem",
      },
      boxShadow: {
        "soft-layer": "0 2px 4px rgba(14, 26, 36, 0.03), 0 12px 32px rgba(14, 26, 36, 0.06)",
        "hover-card": "0 4px 8px rgba(14, 26, 36, 0.04), 0 20px 48px rgba(14, 26, 36, 0.08)",
        "glow-teal": "0 0 35px rgba(18, 181, 166, 0.25)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
