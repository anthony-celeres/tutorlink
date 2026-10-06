import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            50: "#eef6ff",
            100: "#d9ebff",
            200: "#bcdbff",
            300: "#8ec4ff",
            400: "#58a2ff",
            500: "#2f7eff",
            600: "#135bec",
            700: "#0052b4", // TutorLink primary Navy
            800: "#0a4595",
            900: "#0e3b78",
            950: "#08244f",
          },
          teal: {
            50: "#edfcfa",
            100: "#cff7f2",
            200: "#a3efe6",
            300: "#69e1d4",
            400: "#31cbbe",
            500: "#00a896", // TutorLink primary Teal
            600: "#118c81",
            700: "#127068",
            800: "#135954",
            900: "#144a46",
            950: "#052a28",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
