import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#fdfaf3",
          100: "#faf5e9",
          200: "#f4ead4",
          300: "#ebdcb8",
          400: "#dcc592",
          500: "#c9a978",
        },
        brass: {
          400: "#caa46a",
          500: "#b58853",
          600: "#9a6d3e",
          700: "#7a522d",
        },
        copper: {
          500: "#b87333",
          600: "#9a5a26",
        },
        ink: {
          700: "#5c4632",
          800: "#42301f",
          900: "#2b1d10",
        },
      },
      fontFamily: {
        // サイト全体を丸ゴシックに統一。font-serif も同じフォントにマップして、
        // 既存の font-serif 指定箇所(見出しなど)を編集せずに丸ゴシック化する。
        sans: [
          "var(--font-zen-maru)",
          "Hiragino Maru Gothic ProN",
          "Hiragino Kaku Gothic ProN",
          "system-ui",
          "Meiryo",
          "sans-serif",
        ],
        serif: [
          "var(--font-zen-maru)",
          "Hiragino Maru Gothic ProN",
          "Hiragino Kaku Gothic ProN",
          "system-ui",
          "Meiryo",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 6px 18px -8px rgba(122, 82, 45, 0.25)",
        card: "0 10px 30px -16px rgba(122, 82, 45, 0.35)",
        plate: "0 2px 0 rgba(154, 109, 62, 0.18), 0 12px 30px -18px rgba(122, 82, 45, 0.4)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(154, 109, 62, 0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(154, 109, 62, 0.10) 1px, transparent 1px)",
        paper:
          "radial-gradient(circle at 20% 10%, rgba(202, 164, 106, 0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(184, 115, 51, 0.12), transparent 45%)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
        "spin-slower": "spin 32s linear infinite reverse",
      },
    },
  },
  plugins: [],
};

export default config;
