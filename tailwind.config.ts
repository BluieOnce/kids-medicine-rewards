import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/games/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        reward: {
          gold: "#fbbf24",
          star: "#f59e0b",
        },
        calm: {
          light: "#e0f2fe",
          medium: "#7dd3fc",
          deep: "#0284c7",
        },
      },
      animation: {
        "breathe-in": "breatheIn 4s ease-in-out",
        "breathe-out": "breatheOut 4s ease-in-out",
        "star-burst": "starBurst 0.6s ease-out forwards",
        "float-up": "floatUp 2s ease-out forwards",
        "bounce-in": "bounceIn 0.5s ease-out",
      },
      keyframes: {
        breatheIn: {
          "0%": { transform: "scale(0.5)", opacity: "0.6" },
          "100%": { transform: "scale(1.2)", opacity: "1" },
        },
        breatheOut: {
          "0%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(0.5)", opacity: "0.6" },
        },
        starBurst: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1.5) rotate(180deg)", opacity: "0" },
        },
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100px)", opacity: "0" },
        },
        bounceIn: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
