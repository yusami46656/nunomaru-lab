// 家謎の作品レジストリ（単一ソース）。
// トップの作品棚・作品一覧・作品詳細・FAQ抜粋がすべてここを参照する。
// ※現状はダミー。アセット・本文は後で差し替える。

export type WorkType = "free" | "paid";

export interface Work {
  /** URL slug（/ienazo/works/[slug]、/ienazo/play/[slug]） */
  slug: string;
  title: string;
  /** 一言紹介（棚・カード用、ネタバレなし） */
  tagline: string;
  /** あらすじ（詳細用、ネタバレなし） */
  summary: string;
  type: WorkType;
  /** 税込価格（円）。無料は 0 */
  priceJPY: number;
  /** プレイ時間の目安（分） */
  minutes: number;
  /** 難易度 1=やさしい 2=ふつう 3=歯ごたえ */
  difficulty: 1 | 2 | 3;
  /** 推奨人数 */
  players: string;
  /** 推奨環境 */
  environment: string;
  /** 必要なもの */
  needs: string;
  /** カバー画像（縦3:4・作品棚のカード用） */
  cover: string;
  /** ヒーロー画像（横16:9・カバーフロー/詳細ヒーロー用） */
  hero: string;
  /** STORY 章で見せるプレイ画面の抜粋（ネタバレなしの背景など） */
  storyShots?: { src: string; caption: string }[];
  /** プレイエンジンの入口（別タブ全画面で起動。有料はゲートを通す） */
  playUrl: string;
  /**
   * Stripe の Price ID（有料作品のみ）。未設定なら priceJPY から
   * その場で price_data を組んで Checkout する（テスト用フォールバック）。
   */
  stripePriceId?: string;
  /**
   * 準備中（未公開）。タイトル・価格・あらすじ・購入/プレイ導線をすべて伏せ、
   * 「準備中」プレースホルダとして棚に出す。詳細・プレイページは 404。
   */
  comingSoon?: boolean;
}

// 準備中プレースホルダ。タイトル等は伏せ、棚では「準備中」カードで描画する。
// 中身（slug/価格/あらすじ）はUIに出さないが、型を満たすため最小値を入れる。
function comingSoonWork(slug: string): Work {
  return {
    slug,
    title: "準備中",
    tagline: "近日公開",
    summary: "",
    type: "paid",
    priceJPY: 0,
    minutes: 0,
    difficulty: 1,
    players: "",
    environment: "",
    needs: "",
    cover: "",
    hero: "",
    playUrl: "",
    comingSoon: true,
  };
}

// 公開カタログ＝3作品（無料体験1＋準備中2）。
// 未完成作（本コピー・本番アセット・法務が未整備）は伏せ、完成次第ここへ昇格する。
export const WORKS: Work[] = [
  {
    slug: "broken-android",
    title: "壊れたアンドロイド",
    tagline: "はじめての人へ。15分でひと巡りできる無料体験。",
    summary:
      "あなたは、アンドロイドの整備士。\n「故障した一体を、引き取ってほしい」——\nそんな依頼で、人気のない研究施設を訪れます。\n\n椅子に座らせた世話型アンドロイドは、\n電源が落ちたまま、ぴくりとも動きません。\n\n薄暗い部屋に残された手がかりを集め、\n彼女を目覚めさせる『起動コード』を、\nひとつずつ組み上げていく。\n\n——けれど、コードを入力しても。\n彼女は、目を覚ましません。\n\nこの子は、本当に“壊れて”いるのでしょうか。\n\n15分でひと巡りできる、家謎の入口となる無料体験です。",
    type: "free",
    priceJPY: 0,
    minutes: 15,
    difficulty: 2,
    players: "1人〜",
    environment: "PC・タブレット推奨（スマホも可）",
    needs: "特になし",
    // 作品画像はサイト側 public/ienazo/works/<slug>/ に置く規約（エンジンのアセットとは別管理＝別デプロイ・別オリジンのため）。
    cover: "/ienazo/works/broken-android/kv_cover.webp",
    hero: "/ienazo/works/broken-android/title.webp",
    // STORY のギャラリー（左に大きく1枚＋下にサムネ）。caption は alt 用（画面には出さない）。
    storyShots: [
      { src: "/ienazo/works/broken-android/bg_lab.webp", caption: "薄暗い研究室と、停止したアンドロイド" },
      { src: "/ienazo/works/broken-android/bg_exterior.webp", caption: "引き取りに訪れた、古びた施設" },
      { src: "/ienazo/works/broken-android/ui_screen.webp", caption: "胸の制御画面（起動コードの入力）" },
      { src: "/ienazo/works/broken-android/fig_sheets_set.webp", caption: "透明シートの手がかり" },
      { src: "/ienazo/works/broken-android/fig_phone.webp", caption: "外部との連絡が絶えた、古い電話" },
      { src: "/ienazo/works/broken-android/fig_diary.webp", caption: "棚に残された、古い日誌" },
    ],
    playUrl: "/ienazo/play/broken-android",
  },
  comingSoonWork("coming-soon-1"),
  comingSoonWork("coming-soon-2"),
];

/**
 * 公開前の制作中作品の控え。完成したら該当エントリを WORKS の準備中枠と
 * 差し替えて公開する（タイトル・本コピー・本番アセット・法務の整備が前提）。
 * ※ここにある作品は UI には一切出ない。
 */
export const DRAFT_WORKS: Work[] = [
  {
    slug: "heart-no-inai-kuni",
    title: "ハートのいない国",
    tagline: "あべこべの国をめぐる、歯ごたえのある物語。",
    summary:
      "夕暮れの庭で、姉アリサは今日も、体の弱い妹ハートの世話をしている。\nふたりのお気に入りは、『不思議の国のアリス』のごっこ遊び。\n\n「お姉ちゃん。お庭の奥に、不思議の国へ続く穴があるの。知ってた?」\n\nそう言って、妹ハートは笑いながら、暗い穴へ飛び込んでいく。\n慌てて追いかけた、その先は——\n\n白い薔薇がどこまでも続く、見知らぬ庭。\nハートの姿は、もう、どこにもない。\n\n「待っててね、ハート。すぐに、見つけるから」\n\n木の上で笑う猫、逆さまの茶会、霧のチェス盤。\nあべこべの国をめぐり、いくつもの謎を解きながら、妹の行方を追っていく。\n\n——アリサは、ハートを見つけ出せるだろうか。\n\nたっぷり60分、歯ごたえのある謎に浸る、本格の一作です。",
    type: "paid",
    priceJPY: 1500,
    minutes: 60,
    difficulty: 3,
    players: "1人〜2人",
    environment: "PC・タブレット推奨（スマホも可）",
    needs: "紙とペンがあると便利",
    // 本番アセット（エンジン採用画像から合成／scripts/build-heart-site-assets.mjs）。
    cover: "/ienazo/works/heart-no-inai-kuni/cover.webp",
    hero: "/ienazo/works/heart-no-inai-kuni/hero.webp",
    storyShots: [
      { src: "/ienazo/works/heart-no-inai-kuni/key_sisters.webp", caption: "白い薔薇の庭を駆けぬける、ふたりの少女" },
      { src: "/ienazo/works/heart-no-inai-kuni/cg_ch1_1.webp", caption: "木の上でニヤリと笑う猫と、見上げる少女" },
      { src: "/ienazo/works/heart-no-inai-kuni/bg_trump_garden.webp", caption: "白い薔薇が咲きみだれる、トランプの庭" },
      { src: "/ienazo/works/heart-no-inai-kuni/cg_ch2_1.webp", caption: "霧のチェス盤の森で、黒のナイトと向きあう" },
      { src: "/ienazo/works/heart-no-inai-kuni/bg_tea_party.webp", caption: "上も下もあべこべの、逆さまの茶会" },
      { src: "/ienazo/works/heart-no-inai-kuni/cg_ch3_1.webp", caption: "帽子屋たちが出迎える、にぎやかで少し寂しい茶会" },
      { src: "/ienazo/works/heart-no-inai-kuni/bg_world_map.webp", caption: "いくつもの国をめぐる、不思議の国の地図" },
    ],
    playUrl: "/ienazo/play/heart-no-inai-kuni",
  },
  {
    slug: "kurayami-no-shokutaku",
    title: "くらやみの食卓",
    tagline: "灯りの消えた食卓に、なにが起きたのか。",
    summary:
      "一家が囲んでいたはずの食卓には、誰もいない。残された皿とメモを手がかりに、その夜の出来事を解きほぐしていく中編です。",
    type: "paid",
    priceJPY: 1200,
    minutes: 45,
    difficulty: 2,
    players: "1人〜",
    environment: "PC・タブレット推奨（スマホも可）",
    needs: "特になし",
    cover: "/ienazo/dummy/cover-03.svg",
    hero: "/ienazo/dummy/hero-03.svg",
    playUrl: "/ienazo/play/kurayami-no-shokutaku",
  },
  {
    slug: "tokeijikake-no-niwa",
    title: "とけいじかけの庭",
    tagline: "時計の進む庭で、止まった時間をさがす。",
    summary:
      "歯車仕掛けの庭園で、ひとつだけ止まった時計がある。植物と仕掛けを読み解きながら、庭に隠された時間の秘密へ近づいていきます。",
    type: "paid",
    priceJPY: 1000,
    minutes: 30,
    difficulty: 2,
    players: "1人〜",
    environment: "PC・タブレット推奨（スマホも可）",
    needs: "特になし",
    cover: "/ienazo/dummy/cover-04.svg",
    hero: "/ienazo/dummy/hero-04.svg",
    playUrl: "/ienazo/play/tokeijikake-no-niwa",
  },
  {
    slug: "yoru-no-toshokan",
    title: "夜の図書館",
    tagline: "閉館後の図書館で、一冊だけ抜けた棚をさがす。",
    summary:
      "灯りの落ちた図書館。背表紙の並びと貸出記録を頼りに、誰かが持ち出した一冊と、その理由を追っていく中編です。",
    type: "paid",
    priceJPY: 1300,
    minutes: 50,
    difficulty: 2,
    players: "1人〜",
    environment: "PC・タブレット推奨（スマホも可）",
    needs: "特になし",
    cover: "/ienazo/dummy/cover-05.svg",
    hero: "/ienazo/dummy/hero-05.svg",
    playUrl: "/ienazo/play/yoru-no-toshokan",
  },
  {
    slug: "wasureji-no-tegami",
    title: "わすれじの手紙",
    tagline: "差出人のない手紙が、少しずつ記憶をひらく。",
    summary:
      "ポストに届いた、宛名だけの手紙。便箋に残された痕跡をたどると、忘れていたはずの約束が浮かび上がってくる短編です。",
    type: "paid",
    priceJPY: 900,
    minutes: 25,
    difficulty: 1,
    players: "1人〜",
    environment: "PC・タブレット推奨（スマホも可）",
    needs: "特になし",
    cover: "/ienazo/dummy/cover-06.svg",
    hero: "/ienazo/dummy/hero-06.svg",
    playUrl: "/ienazo/play/wasureji-no-tegami",
  },
];

/** 無料体験作品（入口） */
export const FREE_TRIAL: Work = WORKS.find((w) => w.type === "free")!;

/** 難易度の星表記 */
export function difficultyStars(d: Work["difficulty"]): string {
  return "★".repeat(d) + "☆".repeat(3 - d);
}
