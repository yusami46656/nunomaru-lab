"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { harassmentQuestions, type Choice, type ChoiceId } from "@/data/harassment-type";
import {
  calculatePercentages,
  calculateRawScores,
  determineTypeId,
} from "@/lib/harassment-type/scoring";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const CHOICE_LABELS = ["A", "B", "C", "D"] as const;

export default function HarassmentTypeQuestionsPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ChoiceId>>({});
  const shuffledRef = useRef<Choice[][]>([]);
  const [ready, setReady] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const typeIdRef = useRef<string>("");

  useEffect(() => {
    shuffledRef.current = harassmentQuestions.map((q) => shuffleArray(q.choices));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!diagnosing) return;
    const timer = setTimeout(() => {
      router.push(`/contents/harassment-type/results/${typeIdRef.current}`);
    }, 3500);
    return () => clearTimeout(timer);
  }, [diagnosing, router]);

  const total = harassmentQuestions.length;
  const currentQ = harassmentQuestions[currentIndex];
  const currentChoices = shuffledRef.current[currentIndex] ?? currentQ.choices;
  const progress = Math.round((currentIndex / total) * 100);

  const handleSelect = (choiceId: ChoiceId) => {
    const newAnswers = { ...answers, [currentQ.id]: choiceId };
    setAnswers(newAnswers);

    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const raw = calculateRawScores(newAnswers);
      const pct = calculatePercentages(raw);
      const typeId = determineTypeId(pct);

      typeIdRef.current = typeId;

      // 集計送信（fire-and-forget: 失敗してもユーザー体験に影響させない）
      const answersStr = harassmentQuestions.map((q) => newAnswers[q.id] ?? "A").join("");
      fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          typeId,
          scores: pct,
          answers: answersStr,
        }),
      }).catch(() => {});

      sessionStorage.setItem(
        "harassment-type-result",
        JSON.stringify({ typeId, scores: pct }),
      );

      setDiagnosing(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  if (!ready) return null;

  if (diagnosing) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-10 py-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
          <div className="space-y-2">
            <p className="text-2xl font-bold text-zinc-900 sm:text-3xl">診断中…</p>
            <p className="text-sm text-zinc-500">あなたの回答を解析しています</p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <section>
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Harassment Type Diagnosis
        </p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
          ハラスメントタイプ診断
        </h1>
      </section>

      {/* プログレスバー */}
      <section aria-label="進捗">
        <div className="flex items-center justify-between text-sm text-zinc-600 mb-2">
          <span>Q{currentIndex + 1} / {total}</span>
          <span aria-hidden>{progress}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={currentIndex}
        >
          <div
            className="h-full rounded-full bg-zinc-900 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* 質問カード: key で強制再マウントして選択色のキャリーオーバーを防ぐ */}
      <section key={currentQ.id} className="ht-card space-y-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <p className="text-base leading-relaxed text-zinc-900 font-medium">
            {currentQ.scenario}
          </p>
        </div>

        <fieldset>
          <legend className="sr-only">設問 {currentIndex + 1} の選択肢</legend>
          <div className="space-y-2">
            {currentChoices.map((choice, idx) => {
              const label = CHOICE_LABELS[idx];
              const isSelected = answers[currentQ.id] === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={(e) => { (e.currentTarget as HTMLButtonElement).blur(); handleSelect(choice.id); }}
                  className={`w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm sm:text-base leading-relaxed transition-colors ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-800"
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      isSelected
                        ? "border-white/40 bg-white/20 text-white"
                        : "border-zinc-300 bg-zinc-50 text-zinc-600"
                    }`}
                  >
                    {label}
                  </span>
                  <span>{choice.text}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </section>

      {/* ナビゲーション */}
      <div className="flex items-center gap-3">
        {currentIndex > 0 ? (
          <button type="button" onClick={handleBack} className="ht-btn-ghost">
            ← 前の問へ
          </button>
        ) : (
          <Link href="/contents/harassment-type" className="ht-btn-ghost">
            ← 診断トップへ
          </Link>
        )}
      </div>
    </div>
  );
}
