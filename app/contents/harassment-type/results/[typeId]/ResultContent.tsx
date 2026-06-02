"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { HarassmentType } from "@/data/harassment-type";
import type { PercentScores } from "@/lib/harassment-type/scoring";
import ShareButtons from "@/components/harassment-type/ShareButtons";
function ScoreBar({
  attr,
  label,
  pct,
  color,
}: {
  attr: string;
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold" style={{ color }}>
          {attr}
          <span className="ml-1.5 text-zinc-500 font-normal text-xs">{label}</span>
        </span>
        <span className="font-bold text-zinc-900">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

const ATTR_LABELS: Record<string, string> = {
  P: "パワハラ傾向",
  M: "モラハラ傾向",
  S: "セクハラ傾向",
  C: "カスハラ傾向",
};

export default function ResultContent({ typeData }: { typeData: HarassmentType }) {
  const [scores, setScores] = useState<PercentScores | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("harassment-type-result");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.typeId === typeData.id && parsed.scores) {
          setScores(parsed.scores);
        }
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [typeData.id]);

  return (
    <div className="space-y-6">
      {/* タイトルロゴ */}
      <div className="flex justify-center -mt-8 sm:-mt-12 -mb-4 sm:-mb-6">
        <Image
          src="/tools/harassment-type/hero/title.png"
          alt="ハラスメントタイプ診断"
          width={2159}
          height={540}
          className="w-full sm:max-w-2xl h-auto"
          priority
        />
      </div>

      {/* タイプカード */}
      <section
        className="ht-card"
        style={{ borderColor: typeData.colors.main + "30", backgroundColor: typeData.colors.pale }}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch">
          {!imgError ? (
            <div className="relative w-48 sm:w-72 aspect-[3/4] shrink-0 overflow-hidden rounded-2xl">
              <Image
                src={typeData.imagePath}
                alt={typeData.name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div
              className="flex w-48 sm:w-72 aspect-[3/4] shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: typeData.colors.main + "20" }}
            >
              <span
                className="text-5xl font-bold"
                style={{ color: typeData.colors.main }}
              >
                {typeData.attributesLabel || "?"}
              </span>
            </div>
          )}

          <div className="flex-1 text-center sm:text-left sm:flex sm:flex-col sm:justify-center sm:gap-4">
            <div className="space-y-2">
              <p
                className="text-sm font-bold tracking-widest uppercase"
                style={{ color: typeData.colors.main }}
              >
                Your Type
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl" style={{ color: typeData.colors.main }}>
                {typeData.name}
              </h1>
              {typeData.attributesLabel && (
                <p
                  className="text-base font-bold tracking-widest sm:text-lg"
                  style={{ color: typeData.colors.main }}
                >
                  {typeData.attributesLabel.split("").join(" · ")}
                </p>
              )}
            </div>
            <p className="mt-4 sm:mt-0 text-sm sm:text-base leading-relaxed text-zinc-700">
              {typeData.caption}
            </p>
          </div>
        </div>
      </section>

      {/* スコアバー */}
      {scores && (
        <section className="ht-card space-y-4">
          <h2 className="text-base font-bold text-zinc-900">あなたの傾向スコア</h2>
          <div className="space-y-3">
            {(["P", "M", "S", "C"] as const).map((attr) => (
              <ScoreBar
                key={attr}
                attr={attr}
                label={ATTR_LABELS[attr]}
                pct={scores[attr]}
                color={typeData.colors.main}
              />
            ))}
          </div>
        </section>
      )}

      {/* 口癖 */}
      <section className="ht-card space-y-3">
        <h2 className="text-base font-bold text-zinc-900">口癖</h2>
        <ul className="space-y-2">
          {typeData.phrases.map((phrase, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm sm:text-base text-zinc-700 leading-relaxed"
            >
              <span
                className="mt-0.5 shrink-0 text-xs font-bold"
                style={{ color: typeData.colors.main }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{phrase}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 特殊能力 */}
      <section className="ht-card space-y-4">
        <h2 className="text-base font-bold text-zinc-900">特殊能力</h2>
        <div className="space-y-4">
          {typeData.abilities.map((ability, i) => (
            <div key={i}>
              <p className="text-sm sm:text-base font-bold text-zinc-900">
                <span className="mr-1.5" style={{ color: typeData.colors.main }}>
                  ◆
                </span>
                {ability.name}
              </p>
              <p className="mt-1 text-sm sm:text-base leading-relaxed text-zinc-600">
                {ability.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* アドバイス */}
      <section className="ht-card space-y-4">
        <h2 className="text-base font-bold text-zinc-900">アドバイス</h2>
        <div className="space-y-4">
          {typeData.advice.map((item, i) => {
            const splitAt = item.indexOf("。") + 1;
            const first = item.slice(0, splitAt);
            const rest = item.slice(splitAt);
            return (
              <div
                key={i}
                className="text-sm sm:text-base leading-relaxed border-l-2 pl-4"
                style={{ borderColor: typeData.colors.main }}
              >
                <strong className="text-zinc-900">{first}</strong>
                {rest && (
                  <>
                    <br />
                    <span className="text-zinc-700">{rest}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* シェア */}
      <section className="ht-card space-y-4">
        <h2 className="text-base font-bold text-zinc-900">結果をシェア</h2>
        <ShareButtons typeData={typeData} scores={scores} />
      </section>

      {/* ナビゲーション */}
      <section className="flex flex-wrap gap-3 pt-2">
        <Link href="/tools/harassment-type/questions" className="ht-btn-ghost">
          もう一度診断する
        </Link>
        <Link href="/tools/harassment-type/types" className="ht-btn-ghost">
          他のタイプを見る
        </Link>
        <Link href="/tools" className="ht-btn-ghost">
          他のゲームを見る
        </Link>
        <Link href="/tools/harassment-type" className="ht-btn-ghost">
          診断トップへ
        </Link>
      </section>
    </div>
  );
}
