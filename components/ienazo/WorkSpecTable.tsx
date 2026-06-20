import { difficultyStars, type Work } from "@/data/ienazo/works";

/**
 * 作品詳細のスペック表（購入判断の核）。
 * 優先度：時間 ＞ 難易度 ＞ 推奨環境。
 */
export function WorkSpecTable({ work }: { work: Work }) {
  const rows: [string, string][] = [
    ["プレイ時間", `約${work.minutes}分`],
    ["難易度", `${difficultyStars(work.difficulty)}（${["", "やさしい", "ふつう", "歯ごたえあり"][work.difficulty]}）`],
    ["推奨人数", work.players],
    ["推奨環境", work.environment],
    ["必要なもの", work.needs],
    [
      "保存",
      work.type === "paid"
        ? "途中保存・再開できます（ログインで進捗を保存）"
        : "この端末・ブラウザ内に進捗が保存されます",
    ],
  ];

  return (
    <dl className="border-t border-ienazo-rule">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="grid grid-cols-[7rem_1fr] gap-4 border-b border-ienazo-line py-4 sm:grid-cols-[10rem_1fr]"
        >
          <dt className="text-sm font-bold tracking-wide text-ienazo-ink-soft">{k}</dt>
          <dd className="text-sm leading-relaxed text-ienazo-ink sm:text-base">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
