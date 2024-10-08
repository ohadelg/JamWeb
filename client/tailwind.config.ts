import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#f7fafc",
          200: "#edf2f7",
          300: "#e2e8f0",
          400: "#cbd5e0",
          500: "#a0aec0",
          600: "#718096",
          700: "#4a5568",
          800: "#2d3748",
          900: "#1a202c",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  // purge: {
  //   enabaled: false,
  //   content: [
  //     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  //     "./components/**/*.{js,ts,jsx,tsx,mdx}",
  //     "./app/**/*.{js,ts,jsx,tsx,mdx}",],
  //   option: {
  //     safelist: ['h-7/10', 'w-4/5'],
  //   }
  // }
};
export default config;
