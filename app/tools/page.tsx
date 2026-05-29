import type { Metadata } from "next";
import { ExperimentNoteRow } from "@/components/ExperimentNoteRow";
import { experiments } from "@/data/experiments";

export const metadata: Metadata = {
  title: "制作ログ",
  description:
    "ぬのまる工房で公開中・制作中の道具と、その制作過程・試行錯誤をまとめたnote記事の一覧です。",
};

export default function ToolsPage() {
  return (
    <div className="space-y-10 animate-sys-fade-in">
      <section className="space-y-3">
        <p className="sys-eyebrow">MAKING NOTE</p>
        <h1 className="sys-heading text-3xl font-bold sm:text-4xl">制作ログ</h1>
        <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--sys-text)" }}>
          AIで何を作り、どこで詰まり、何を考えたのか。各道具の制作の裏側や試行錯誤をまとめています。
        </p>
      </section>

      <div className="sys-rule" />

      <section>
        {experiments.length === 0 ? (
          <div className="sys-panel-flat p-6 text-center text-sm" style={{ color: "var(--sys-text-muted)" }}>
            まだ公開中の道具はありません。準備中です。
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
