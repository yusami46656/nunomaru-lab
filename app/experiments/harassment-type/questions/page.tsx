"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stamp } from "@/components/decorations/Stamp";
import {
  LIKERT_OPTIONS,
  harassmentQuestions,
  type LikertValue,
} from "@/data/harassment-type";

export default function HarassmentTypeQuestionsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, LikertValue>>({});

  const total = harassmentQuestions.length;
  const answered = Object.keys(answers).length;
  const progress = useMemo(
    () => (total === 0 ? 0 : Math.round((answered / total) * 100)),
    [answered, total],
  );
  const allAnswered = answered === total && total > 0;

  const handleSelect = (id: string, value: LikertValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    // 仮実装: ロジック未実装のため固定の sample 結果ページへ遷移する。
    router.push("/experiments/harassment-type/results/sample");
  };

  return (
    <div className="space-y-8">
      <section>
        <Stamp label="QUESTIONS / 仮実装" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold sm:text-4xl">
          ハラスメントタイプ診断 設問
        </h1>
        <p className="mt-3 text-sm text-ink-700 sm:text-base">
          現在は仮の {total} 問を表示しています。本番では28問程度に拡張予定です。
        </p>
      </section>

      <section aria-label="進捗" className="nl-plate">
        <div className="flex items-center justify-between text-sm text-ink-800">
          <span>
            進捗 {answered} / {total}
          </span>
          <span aria-hidden>{progress}%</span>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-parchment-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answered}
        >
          <div
            className="h-full rounded-full bg-brass-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ol className="space-y-6">
          {harassmentQuestions.map((q, i) => (
            <li key={q.id} className="nl-card">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brass-500/60 bg-parchment-50 font-serif text-xs text-brass-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-ink-900">{q.text}</p>
              </div>

              <fieldset className="mt-5">
                <legend className="sr-only">設問 {i + 1} の選択肢</legend>
                <div className="grid gap-2 sm:grid-cols-5">
                  {LIKERT_OPTIONS.map((opt) => {
                    const checked = answers[q.id] === opt.value;
                    const inputId = `${q.id}-${opt.value}`;
                    return (
                      <label
                        key={opt.value}
                        htmlFor={inputId}
                        className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border px-3 py-2.5 text-center text-xs leading-snug transition-colors sm:text-[11px] ${
                          checked
                            ? "border-brass-600 bg-parchment-200 text-ink-900"
                            : "border-brass-500/30 bg-parchment-50 text-ink-700 hover:border-brass-500 hover:bg-parchment-100"
                        }`}
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={checked}
                          onChange={() => handleSelect(q.id, opt.value)}
                          className="sr-only"
                        />
                        <span className="font-serif text-sm font-bold text-brass-700">
                          {opt.value}
                        </span>
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/experiments/harassment-type" className="nl-btn-ghost">
            ← 説明に戻る
          </Link>
          <button
            type="submit"
            disabled={!allAnswered}
            className="nl-btn disabled:cursor-not-allowed disabled:opacity-50"
            aria-disabled={!allAnswered}
          >
            結果を見る
            <span aria-hidden>→</span>
          </button>
        </div>

        {!allAnswered && (
          <p className="text-center text-xs text-ink-700/80">
            すべての設問に回答すると「結果を見る」が押せます。
          </p>
        )}
      </form>
    </div>
  );
}
