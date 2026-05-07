# ぬのまるの実験工房

AI で作った小さな企画を、実際に触れる形で実験的に公開していく工房サイト。

- 公開ドメイン想定: `nunomaru-lab.com`
- 制作ログや AI 活用メモは [note](https://note.com/nunomaru0x0u) で公開

## 技術構成

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v3
- Vercel デプロイ前提

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開く。

## ディレクトリ構成

```
app/
├── layout.tsx                 # 共通レイアウト・SEO 既定値
├── page.tsx                   # トップ
├── not-found.tsx              # 404
├── about/                     # About
├── contact/                   # Contact
├── privacy/                   # Privacy Policy
├── disclaimer/                # Disclaimer
└── experiments/
    ├── page.tsx               # 実験一覧
    └── harassment-type/
        ├── page.tsx           # 診断トップ
        ├── questions/         # 仮の設問ページ (Client Component)
        └── results/sample/    # 仮の結果ページ
components/
├── Header.tsx
├── Footer.tsx
├── ExperimentCard.tsx
└── decorations/               # 歯車・スタンプ・リベットなどの装飾
data/
├── experiments.ts             # 実験カードのデータソース
└── harassment-type.ts         # 診断の設問・選択肢
lib/
└── external-links.ts          # note / X などの外部リンク
public/
└── README.md                  # 画像差し替えの案内
```

## 実験の追加方法

`data/experiments.ts` の `experiments` 配列に項目を追加するだけで、トップページと
`/experiments` 一覧の両方に自動で反映されます。

```ts
{
  slug: "your-experiment",
  title: "実験タイトル",
  description: "短い説明",
  thumbnail: "/experiments/your-experiment/thumb.png", // 任意
  publishedAt: "2026年X月",
  href: "/experiments/your-experiment",
  ctaLabel: "試してみる",
  noteUrl: "https://note.com/...", // 任意
}
```

サムネイル画像が `/public` 配下に存在しない場合は、方眼紙＋歯車のプレースホルダーが
自動表示されるため、画像は後から差し替え可能です。

## 外部リンクの設定

- `lib/external-links.ts` の `EXTERNAL_LINKS.x` を確定後の URL に置き換えると、
  ヘッダー・フッター・Contact ページの「準備中」表示が自動で実リンクに切り替わります。

## デザイン方針メモ

- ベースは生成り〜薄ベージュ (`parchment` 系)
- アクセントは真鍮〜銅 (`brass` / `copper` 系)
- カードは丸みと柔らかい影。歯車・スタンプ・リベット等の装飾を控えめに散らす
- ダークすぎる/サイバーすぎる方向には倒さない
