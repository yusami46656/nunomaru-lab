export type NoteArticle = {
  title: string;
  url: string;
};

export type ToolCategory = "learn" | "play";
export type ToolStatus = "published" | "comingSoon" | "inProgress" | "planning";
export type ToolPriceType = "free" | "paid" | "undecided";

export type Experiment = {
  /** URLスラッグ。/tools/<slug> として展開されることを想定。 */
  slug: string;
  title: string;
  description: string;
  /** 学びの道具 / 遊びの道具 のどちらに並べるか。 */
  category: ToolCategory;
  /** 公開状態。カードの表示・リンクの活性を切り替える。 */
  status: ToolStatus;
  /** /public 配下のサムネイル画像パス。未配置なら placeholder を表示する。 */
  thumbnail?: string;
  /** 公開予定 or 公開済みの目安。'2026年6月公開' のような自由記述。 */
  publishedAt?: string;
  /** 内部リンク or 外部リンク。status が published / comingSoon でのみ使用。 */
  href?: string;
  ctaLabel?: string;
  /** 任意。制作過程・実験結果のnote記事リンク。複数登録可。 */
  noteArticles?: NoteArticle[];
  /** 価格区分。サイト上には強く出さないが、内部管理用に保持。 */
  priceType?: ToolPriceType;
  /** 制作ログページ用。このツールの制作ログ note URL。未設定なら共通 note トップに飛ばす。 */
  noteUrl?: string;
};

export const experiments: Experiment[] = [
  {
    slug: "harassment-type",
    title: "ハラスメントタイプ診断",
    description:
      "職場や日常のコミュニケーションにおけるあなたの危険なクセを、16タイプであぶり出す診断です。実はあなたも無自覚なうちにハラスメントをしてしまっているかも！？",
    category: "play",
    status: "published",
    thumbnail: "/tools/harassment-type/thumb.png",
    publishedAt: "2026年5月",
    href: "/tools/harassment-type",
    ctaLabel: "診断してみる",
    priceType: "free",
    noteUrl: "https://note.com/nunomaru0x0u/n/n9860c5ede581",
  },
  {
    slug: "learn-tool-tbd",
    title: "構想中",
    description:
      "学びの道具の第一弾を構想中です。世界史・神話・哲学などのテーマで準備しています。",
    category: "learn",
    status: "planning",
    priceType: "undecided",
  },
];

export const learnTools = experiments.filter((e) => e.category === "learn");
export const playTools = experiments.filter((e) => e.category === "play");
