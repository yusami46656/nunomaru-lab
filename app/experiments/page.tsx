import type { Metadata } from "next";
import { ExperimentNoteRow } from "@/components/ExperimentNoteRow";
import { Stamp } from "@/components/decorations/Stamp";
import { experiments } from "@/data/experiments";

export const metadata: Metadata = {
  title: "実験ノート",
  description:
    "ぬのまるの実験工房で公開中の実験コンテンツと、その制作過程・実験結果をまとめたnote記事の一覧です。",
};

export default function ExperimentsPage() {
  return (
    <div className="space-y-10">
      <section>
        <Stamp label="NOTE / 実験ノート" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold sm:text-4xl">実験ノート</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-700 sm:text-base">
          各実験の制作過程や実験結果をまとめたnote記事を、実験ごとにまとめています。
        </p>
      </section>

      <section>
        {experiments.length === 0 ? (
          <div className="nl-card text-center text-ink-700">
            まだ公開中の実験はありません。準備中です。
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {experiments.map((exp) => (
              <ExperimentNoteRow key={exp.slug} experiment={exp} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
