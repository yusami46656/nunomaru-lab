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
        sys: {
          bg: "#d8d2bd",
          "bg-soft": "#e6e0cc",
          "panel-dark": "#5b584d",
          text: "#3f3d36",
          "text-muted": "#777263",
          accent: "#b96f4a",
        },
        // ─── 家謎 (ienazo) 特設テーマ ─────────────────────────
        // 白地＋黒の細線で区切る幾何学的(現代美術館)構成。差し色はくすみ赤。
        // /ienazo 配下でのみ使用する。
        ienazo: {
          paper: "#f7f6f2", // 白に寄せた地（ごく僅かに暖かいギャラリー白）
          "paper-soft": "#ffffff", // カード等の純白面
          "paper-deep": "#eceae3",
          ink: "#181818", // ロゴに合わせたニュートラルな黒（文字・構造線）
          "ink-soft": "#5e5c55", // 補助文字（生成り地でAAを満たすよう濃いめ）
          line: "#e4e2da", // 補助の淡線
          // 【#2試作】構造線を黒(#181818)→上質なヘアライン(淡グレー)へ。元に戻すなら #181818。
          rule: "#dcd9d0", // 高級感ヘアライン（要素の境目・グリッド）
          "rule-bold": "#181818", // 強い黒線が要る箇所用に旧値を保持
          red: "#a23a35", // くすみ赤（封蝋・招待状の一点差し色）
          "red-deep": "#7f2c28",
          "red-soft": "#c2685f",
          maroon: "#6e2521", // 深いくすみ赤（無料体験ブロック等の面）
        },
      },
      fontFamily: {
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
        // 家謎: ふわっと柔らかい影
        "ienazo-soft": "0 8px 24px -12px rgba(44, 39, 34, 0.22)",
        "ienazo-card": "0 14px 36px -18px rgba(44, 39, 34, 0.30)",
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
        "sys-fade-in": "sys-fade-in 320ms ease-out both",
        "sys-scan": "sys-scan 60s linear infinite",
      },
      keyframes: {
        "sys-fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "sys-scan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100vh" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
