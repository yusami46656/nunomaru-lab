import type { Metadata } from "next";
import Link from "next/link";
// import Image from "next/image";

export const metadata: Metadata = {
  title: "ハラスメントタイプ診断",
  description:
    "職場や日常のコミュニケーションにおけるあなたの危険なクセを、16タイプであぶり出す診断コンテンツです。全16問・約5分で完了。",
};

const ATTRIBUTES = [
  {
    key: "P",
    name: "パワハラ",
    phrase: "上から支配する",
    desc: "立場や権限を使って従わせようとする傾向",
    color: "#5E4A7C",
  },
  {
    key: "M",
    name: "モラハラ",
    phrase: "内面を裁く",
    desc: "正しさや常識を盾に相手を否定する傾向",
    color: "#3F628E",
  },
  {
    key: "S",
    name: "セクハラ",
    phrase: "境界を越える",
    desc: "身体・恋愛・私生活へ無遠慮に踏み込む傾向",
    color: "#A03B62",
  },
  {
    key: "C",
    name: "カスハラ",
    phrase: "役割につけ込む",
    desc: "役割や責任を盾に過剰な要求をする傾向",
    color: "#C4474F",
  },
] as const;

export default function HarassmentTypeTopPage() {
  return (
    <div className="space-y-12">
      {/* フルブリードヒーロー */}
      <section className="relative -mx-4 sm:-mx-6 -mt-10 sm:-mt-14 overflow-hidden min-h-[45vh] sm:min-h-[60vh] flex items-center">
        {/* グラデーション背景（画像配置後に差し替え） */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#3D2B5E] to-[#8C2A4E]" />
        {/* 画像配置用（ファイル配置後に有効化）: */}
        {/* <Image src="/experiments/harassment-type/hero.png" alt="" fill className="object-cover opacity-40" /> */}

        <div className="relative z-10 px-4 sm:px-6 py-10 sm:py-24 w-full text-center">
          <p className="text-xs font-bold tracking-widest text-white/60 uppercase">
            Harassment Type Diagnosis
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            ハラスメントタイプ診断
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
            あなたの中に潜むモンスター、診断します
          </p>
          <p className="mt-2 text-sm text-white/60">全16問・約5分で完了</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/experiments/harassment-type/questions"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              診断をはじめる →
            </Link>
            <Link
              href="/experiments/harassment-type/types"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              全16タイプを見る
            </Link>
          </div>
        </div>
      </section>

      {/* 4属性の説明 */}
      <section aria-labelledby="attrs-heading">
        <h2 id="attrs-heading" className="text-lg sm:text-xl font-bold text-zinc-900 mb-4">
          4つの診断属性
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ATTRIBUTES.map((attr) => (
            <div
              key={attr.key}
              className="ht-card space-y-2"
              style={{ borderLeftWidth: 3, borderLeftColor: attr.color }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: attr.color }}
                >
                  {attr.key}
                </span>
                <span className="font-bold text-zinc-900 text-sm sm:text-base">{attr.name}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold" style={{ color: attr.color }}>
                {attr.phrase}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-600">{attr.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 結果の見方 */}
      <section aria-labelledby="guide-heading" className="space-y-3">
        <h2 id="guide-heading" className="text-lg sm:text-xl font-bold text-zinc-900">
          結果の見方
        </h2>
        <div className="ht-card space-y-2 text-sm sm:text-base leading-relaxed text-zinc-700">
          <p>
            この診断では、4つの属性（P / M / S / C）それぞれについて、あなたがどれくらい強くその傾向を持っているかを%で表示します。
          </p>
          <p>
            <strong className="text-zinc-900">大事なのは「%の高さ」です。</strong>
            該当する属性の数が多いことが悪いわけではありません。たとえ1つの属性でも%が高ければその傾向は日常で出やすくなります。逆に複数の属性に該当していても、それぞれの%が低ければ注意度はそれほど高くありません。
          </p>
          <p>あくまでエンタメ診断ですが、自分のクセに気づくきっかけとして楽しんでください。</p>
        </div>
      </section>

      {/* 注意書き */}
      <section aria-labelledby="caution-heading">
        <h2 id="caution-heading" className="text-sm sm:text-base font-bold text-zinc-900">
          ご利用にあたっての注意
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm sm:text-base leading-relaxed text-zinc-600">
          <li>・この診断は娯楽・自己理解を目的としたコンテンツです。</li>
          <li>・法的・医学的な判断を行うものではありません。</li>
          <li>・実在の個人や特定の属性を攻撃・断定する意図はありません。</li>
        </ul>
      </section>
    </div>
  );
}
