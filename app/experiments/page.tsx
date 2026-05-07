import type { Metadata } from "next";
import { ExperimentCard } from "@/components/ExperimentCard";
import { Stamp } from "@/components/decorations/Stamp";
import { experiments } from "@/data/experiments";

export const metadata: Metadata = {
  title: "実験一覧",
  description:
    "ぬのまるの実験工房で公開中の実験コンテンツの一覧です。診断・ミニコンテンツ・Web実験を順次追加していきます。",
};

export default function ExperimentsPage() {
  return (
    <div className="space-y-10">
      <section>
        <Stamp label="INDEX / 実験一覧" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold sm:text-4xl">実験一覧</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-700 sm:text-base">
          AIを使って制作した、実際に触れる実験コンテンツを並べています。新しい実験は順次追加していきます。
        </p>
      </section>

      <section>
        {experiments.length === 0 ? (
          <div className="nl-card text-center text-ink-700">
            まだ公開中の実験はありません。準備中です。
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {experiments.map((exp) => (
              <ExperimentCard key={exp.slug} experiment={exp} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
