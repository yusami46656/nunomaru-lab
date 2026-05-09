import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

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
      <section
        className="-mt-10 sm:-mt-14 overflow-x-hidden"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          width: "100vw",
        }}
      >
        {/* ── スマホ用（～639px） ── */}
        <div className="relative sm:hidden">
          <Image
            src="/experiments/harassment-type/hero/hero_phone.png"
            alt=""
            width={1080}
            height={1440}
            className="w-full h-auto block"
            unoptimized
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-[2%] text-center">
            <Image
              src="/experiments/harassment-type/hero/title.png"
              alt="ハラスメントタイプ診断"
              width={2159}
              height={540}
              sizes="100vw"
              className="w-full h-auto"
              priority
            />
            <div className="mt-2 flex flex-col items-center gap-1 w-full px-4">
              <p className="text-sm text-zinc-800">16の職業タイプで、あなたの危険なクセを診断</p>
              <p className="text-xs text-zinc-500">全16問・約5分で完了</p>
              <div className="mt-2 flex flex-col gap-2 w-full max-w-xs">
                <Link
                  href="/experiments/harassment-type/questions"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-700 transition-colors"
                >
                  診断をはじめる →
                </Link>
                <Link
                  href="/experiments/harassment-type/types"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700/50 px-6 py-3 text-sm font-bold text-zinc-800 hover:bg-zinc-100/60 transition-colors"
                >
                  全16タイプを見る
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── PC用（640px〜） ── */}
        <div className="relative hidden sm:block">
          <Image
            src="/experiments/harassment-type/hero/hero_pc.png"
            alt=""
            width={1920}
            height={794}
            className="w-full h-auto block"
            unoptimized
            priority
          />
          {/* コンテンツを上半分（キャラクター領域外）に収める */}
          <div className="absolute top-0 inset-x-0 h-[50%] flex flex-col items-center justify-center px-8 text-center gap-4">
            <Image
              src="/experiments/harassment-type/hero/title.png"
              alt="ハラスメントタイプ診断"
              width={2159}
              height={540}
              sizes="65vw"
              className="w-[65%] h-auto"
              priority
            />
            <div className="-mt-8 flex flex-col items-center gap-4 w-full">
            <p className="text-sm text-zinc-800">16の職業タイプで、あなたの危険なクセを診断</p>
            <p className="text-xs text-zinc-500">全16問・約5分で完了</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/experiments/harassment-type/questions"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-700 transition-colors"
              >
                診断をはじめる →
              </Link>
              <Link
                href="/experiments/harassment-type/types"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700/50 px-5 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-100/60 transition-colors"
              >
                全16タイプを見る
              </Link>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* 4属性の説明 */}
      <section aria-labelledby="attrs-heading">
        <h2 id="attrs-heading" className="text-lg sm:text-xl font-bold text-zinc-900 mb-4">
          4つの診断属性
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
