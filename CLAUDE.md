# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## アーキテクチャ

### 実験の追加方法

`data/experiments.ts` の配列に1エントリ追加するだけで、トップページ(`/`)と実験一覧(`/experiments`)に自動反映される。サムネイルが存在しない場合は方眼紙プレースホルダーが自動表示される。

### ハラスメントタイプ診断 (`/experiments/harassment-type/`)

唯一の実装済み実験。設計の全詳細は `harassment_type_design.md` を参照。

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
