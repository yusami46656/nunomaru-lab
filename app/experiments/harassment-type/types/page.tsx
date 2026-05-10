import Link from "next/link";
import { harassmentTypes, type HarassmentType } from "@/data/harassment-type";

function TypeCard({ type }: { type: HarassmentType }) {
  return (
    <div
      className="ht-card p-3 space-y-0.5"
      style={{ borderTopWidth: 3, borderTopColor: type.colors.main }}
    >
      <span
        className="block text-[10px] font-bold tracking-widest leading-none"
        style={{ color: type.colors.main }}
      >
        {type.attributesLabel
          ? type.attributesLabel.split("").join(" · ")
          : "無属性"}
      </span>
      <p className="text-sm font-bold leading-snug" style={{ color: type.colors.main }}>
        {type.name}
      </p>
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
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {harassmentTypes.map((type) => (
            <TypeCard key={type.id} type={type} />
          ))}
        </div>
      </section>
    </div>
  );
}
