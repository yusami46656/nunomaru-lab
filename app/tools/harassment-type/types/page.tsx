"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { harassmentTypes, type HarassmentType } from "@/data/harassment-type";

function TypeCard({ type }: { type: HarassmentType }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/tools/harassment-type/results/${type.id}`}
      className="ht-card overflow-hidden p-0 block transition-opacity hover:opacity-80"
      style={{ borderTopWidth: 3, borderTopColor: type.colors.main }}
    >
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
            <span className="text-4xl font-bold" style={{ color: type.colors.main }}>
              {type.attributesLabel || "N"}
            </span>
          </div>
        )}
      </div>
      <div className="p-2 space-y-0.5">
        <span
          className="block text-[10px] font-bold tracking-widest leading-none"
          style={{ color: type.colors.main }}
        >
          {type.attributesLabel || "無属性"}
        </span>
        <p className="text-xs font-bold leading-snug" style={{ color: type.colors.main }}>
          {type.name}
        </p>
      </div>
    </Link>
  );
}

export default function HarassmentTypesPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/tools/harassment-type" className="ht-btn-ghost">
            ← 診断トップへ
          </Link>
          <Link href="/tools/harassment-type/questions" className="ht-btn">
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
        <div className="grid grid-cols-4 gap-2">
          {harassmentTypes.map((type) => (
            <TypeCard key={type.id} type={type} />
          ))}
        </div>
      </section>
    </div>
  );
}
