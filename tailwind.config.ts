import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F12",
        surface: "#151B22",
        "surface-light": "#1F2937",
        border: "#21262D",
        accent: {
          green: "#00E599",
          emerald: "#10B981",
          gold: "#F59E0B",
          yellow: "#FBBF24"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
