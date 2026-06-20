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
  /** プレイエンジンの入口（別タブ全画面で起動。有料はゲートを通す） */
  playUrl: string;
  /**
   * Stripe の Price ID（有料作品のみ）。未設定なら priceJPY から
   * その場で price_data を組んで Checkout する（テスト用フォールバック）。
   */
  stripePriceId?: string;
}

export const WORKS: Work[] = [
  {
    slug: "broken-android",
    title: "壊れたアンドロイド",
    tagline: "はじめての人へ。15分でひと巡りできる無料体験。",
    summary:
      "目を覚ましたあなたの前にいるのは、記憶を失くした一体のアンドロイド。短い物語のなかで、家謎の遊び方にそっと触れられる入口の一篇です。",
    type: "free",
    priceJPY: 0,
    minutes: 15,
    difficulty: 1,
    players: "1人〜",
    environment: "PC・タブレット推奨（スマホも可）",
    needs: "特になし",
    cover: "/ienazo/dummy/cover-01.svg",
    hero: "/ienazo/dummy/hero-01.svg",
    playUrl: "/ienazo/play/broken-android",
  },
  {
    slug: "heart-no-inai-kuni",
    title: "ハートのいない国",
    tagline: "あべこべの国をめぐる、歯ごたえのある物語。",
    summary:
      "ハートを失くした不思議の国。逆さまの茶会や玉座の間をめぐりながら、いくつもの謎を解き、最後の大きな謎へと辿り着く本格的な一作です。",
    type: "paid",
    priceJPY: 1500,
    minutes: 60,
    difficulty: 3,
    players: "1人〜2人",
    environment: "PC・タブレット推奨（スマホも可）",
    needs: "紙とペンがあると便利",
    cover: "/ienazo/dummy/cover-02.svg",
    hero: "/ienazo/dummy/hero-02.svg",
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
