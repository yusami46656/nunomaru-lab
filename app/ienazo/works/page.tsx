import type { Metadata } from "next";
import { SectionHeading } from "@/components/ienazo/SectionHeading";
import { Reveal } from "@/components/ienazo/Reveal";
import { WorkCard } from "@/components/ienazo/WorkCard";
import { WORKS } from "@/data/ienazo/works";

export const metadata: Metadata = {
  title: "作品一覧",
  description: "家謎の作品一覧。謎解き・脱出ゲームを、無料体験から有料作品までご覧いただけます。",
};

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        label="WORKS"
        title="家謎の作品一覧"
        description="世界観で選ぶもよし、体験時間で選ぶもよし。気になった物語から、どうぞ。"
      />

      <Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {WORKS.map((w) => (
            <WorkCard key={w.slug} work={w} showPrice />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
