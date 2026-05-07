export type Experiment = {
  /** URLスラッグ。/experiments/<slug> として展開されることを想定。 */
  slug: string;
  title: string;
  description: string;
  /** /public 配下のサムネイル画像パス。未配置なら placeholder を表示する。 */
  thumbnail?: string;
  publishedAt: string;
  href: string;
  ctaLabel: string;
  /** 任意。noteの解説記事リンクなど。 */
  noteUrl?: string;
};

export const experiments: Experiment[] = [
  {
    slug: "harassment-type",
    title: "ハラスメントタイプ診断",
    description:
      "職場や日常のコミュニケーションにおけるあなたの危険なクセを、16タイプであぶり出す診断です。実はあなたも無自覚なうちにハラスメントをしてしまっているかも！？",
    thumbnail: "/experiments/harassment-type/thumb.png",
    publishedAt: "2026年5月",
    href: "/experiments/harassment-type",
    ctaLabel: "診断してみる",
  },
];
