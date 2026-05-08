export type NoteArticle = {
  title: string;
  url: string;
};

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
  /** 任意。制作過程・実験結果のnote記事リンク。複数登録可。 */
  noteArticles?: NoteArticle[];
  /** true のとき未公開扱い。カードからのリンクを無効化し「近日公開」表示にする。 */
  comingSoon?: boolean;
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
    comingSoon: true,
  },
];
