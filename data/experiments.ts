export type NoteArticle = {
  title: string;
  url: string;
};

export type ToolCategory = "mystery" | "fortune";
export type ToolStatus = "published" | "comingSoon" | "inProgress" | "planning";
export type ToolPriceType = "free" | "paid" | "undecided";

export type Experiment = {
  /** URLスラッグ。/tools/<slug> として展開されることを想定。 */
  slug: string;
  title: string;
  description: string;
  /** 謎解き / 占い・診断 のどちらに並べるか。 */
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
    category: "fortune",
    status: "published",
    thumbnail: "/contents/harassment-type/thumb.png",
    publishedAt: "2026年5月",
    href: "/contents/harassment-type",
    ctaLabel: "診断してみる",
    priceType: "free",
    noteUrl: "https://note.com/nunomaru0x0u/n/n9860c5ede581",
  },
  {
    slug: "ienazo",
    title: "家謎",
    description:
      "家謎は、おうちで気軽に遊べる謎解き・脱出ゲームです。あなたは物語の登場人物として、おうちのなかの世界をめぐりながら謎を解いていきます。まずは無料体験から。",
    category: "mystery",
    status: "published",
    thumbnail: "/contents/ienazo/thumb.png",
    publishedAt: "2026年6月",
    href: "/ienazo",
    ctaLabel: "家謎で遊ぶ",
    priceType: "free",
    // noteUrl は未設定＝制作ログ（note）は準備中
  },
];

export const mysteryTools = experiments.filter((e) => e.category === "mystery");
export const fortuneTools = experiments.filter((e) => e.category === "fortune");
