# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 開発サーバー起動 (http://localhost:3000)
npm run build    # プロダクションビルド
npm run lint     # ESLint
```

テストは未導入。

## アーキテクチャ

Next.js 15 App Router + TypeScript + Tailwind CSS v3。Vercel デプロイ前提。

### ディレクトリ構成の意図

- `app/` — ページ・レイアウト・API Route。App Router 規約に従う。
- `components/` — 汎用 UI (`Header`, `Footer`, `ExperimentCard`...) と実験ごとのサブフォルダ (`harassment-type/`)。
- `data/` — 純粋なデータ定数。サーバー/クライアント両方から import される。
- `lib/` — ビジネスロジック（スコア計算・シェアテキスト生成など）。
- `public/experiments/<slug>/` — 実験ごとの静的アセット（`images/`, `og/`, `share/`）。

### 実験の追加方法

`data/experiments.ts` の配列に1エントリ追加するだけで、トップページ(`/`)と実験一覧(`/experiments`)に自動反映される。サムネイルが存在しない場合は方眼紙プレースホルダーが自動表示される。

### ハラスメントタイプ診断 (`/experiments/harassment-type/`)

唯一の実装済み実験。設計の全詳細は `harassment_type_design.md` を参照。

**データフロー:**
1. `data/harassment-type.ts` — `harassmentQuestions`（16問）・`harassmentTypes`（16タイプ）・`typeMap`（属性キー→typeId）を一元管理。
2. `lib/harassment-type/scoring.ts` — 回答からスコア計算・タイプ決定。閾値 40% / ギャップ 20% でタイプを絞り込む。
3. 回答結果は `sessionStorage("harassment-type-result")` に `{ typeId, scores }` 形式で保存。
4. `app/experiments/harassment-type/results/[typeId]/page.tsx` — `generateMetadata` でOGP設定。`ResultContent.tsx`（Client Component）が sessionStorage からスコアを読み込む。
5. `components/harassment-type/ShareButtons.tsx` — X・LINE・Facebook・Instagram への共有ボタン。

**タイプIDと画像ファイル名の対応:**  
`harassmentTypes[].id`（`emperor`, `villager`, `shogun` など）がそのまま画像ファイル名になる。
- `public/experiments/harassment-type/images/<id>.png` — キャラクター画像（3:4）
- `public/experiments/harassment-type/og/<id>.png` — OGP画像（1200×630）
- `public/experiments/harassment-type/share/<id>.png` — Instagram共有用画像

### スタイル設計

2つのデザインシステムが共存している：

| プレフィックス | 対象 | 基調 |
|---|---|---|
| `nl-*` | サイト全体 | 生成り（parchment）＋真鍮（brass）＋インク色 |
| `ht-*` | ハラスメントタイプ診断 | ニュートラルなホワイト／zinc 系 |

カスタムクラスは `app/globals.css` の `@layer components` に定義。  
診断ページは `body.ht-page` クラスでサイト全体の背景をオーバーライドする。

### 環境変数

`.env.local` で管理。

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | AdSense スクリプト読み込み（本番のみ） |
| `NEXT_PUBLIC_ADSENSE_SLOT_RESULT` | 結果ページの広告スロット |

### フォント

Zen Maru Gothic（Google Fonts）をサイト全体に使用。`preload: false` にして Vercel ビルド時の `fonts.gstatic.com` 接続失敗を回避している。`font-serif` も同じフォントにマップ済みなので、クラス名で区別しなくてよい。
