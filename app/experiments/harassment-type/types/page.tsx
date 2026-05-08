"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { harassmentTypes, type HarassmentType } from "@/data/harassment-type";

function TypeCard({ type }: { type: HarassmentType }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="ht-card overflow-hidden p-0"
      style={{ borderTopWidth: 3, borderTopColor: type.colors.main }}
    >
      {/* 画像エリア */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden"
        style={{ backgroundColor: type.colors.pale }}
      >
        {!imgError ? (
          <Image
            src={type.imagePath}
            alt={type.name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className="text-5xl font-bold"
              style={{ color: type.colors.main }}
            >
              {type.attributesLabel || "N"}
            </span>
          </div>
        )}
      </div>

      {/* テキストエリア */}
      <div className="p-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold tracking-widest"
            style={{ color: type.colors.main }}
          >
            {type.attributesLabel
              ? type.attributesLabel.split("").join(" · ")
              : "無属性"}
          </span>
        </div>
        <p className="font-bold" style={{ color: type.colors.main }}>
          {type.name}
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-zinc-600 line-clamp-3">
          {type.caption}
        </p>
      </div>
    </div>
  );
}

export default function HarassmentTypesPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/experiments/harassment-type" className="ht-btn-ghost">
            ← 診断トップへ
          </Link>
          <Link href="/experiments/harassment-type/questions" className="ht-btn">
            診断をはじめる →
          </Link>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
            All Types
          </p>
          <h1 className="mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl">
            16タイプ一覧
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            診断では4属性（P / M / S / C）の組み合わせから16タイプが判定されます。
          </p>
        </div>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {harassmentTypes.map((type) => (
            <TypeCard key={type.id} type={type} />
          ))}
        </div>
      </section>
    </div>
  );
}
