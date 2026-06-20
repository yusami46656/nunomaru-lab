# 家謎（ienazo）バックエンド セットアップ

Supabase Auth → 所有権（entitlements）→ Stripe（テスト）→ プレイゲート の土台。
キー未設定（`.env.local` が `REPLACE_ME` のまま）でもサイトは壊れず、各機能は
「準備中」表示にフォールバックする。実値を入れると有効化される。

## 受け渡し契約（Step0）

- **無料作品**：トークンなし・端末内セーブ。ゲートのボタンから直接エンジンを別タブ起動。
- **有料作品**：ログイン → 所有検証（`ienazo_entitlements`）→ 短命チケット（JWT, 既定90秒）
  発行 → エンジンを `?ticket=...` 付きで別タブ起動。エンジン側は後日 `verify-ticket` で検証。

## 構成

| 種別 | パス |
|---|---|
| 設定（公開値・readiness 判定） | `lib/ienazo/config.ts` |
| Supabase クライアント | `lib/ienazo/supabase/{client,server,admin,middleware}.ts` |
| セッション維持 middleware | `middleware.ts`（matcher を `/ienazo` 配下に限定） |
| 所有検証ヘルパー | `lib/ienazo/entitlements.ts` |
| 短命チケット | `lib/ienazo/ticket.ts` |
| Checkout 作成 | `app/api/ienazo/checkout/route.ts` |
| Stripe Webhook | `app/api/ienazo/webhook/route.ts` |
| チケット発行 | `app/api/ienazo/ticket/route.ts` |
| 認証コールバック | `app/ienazo/account/callback/route.ts` |
| UI | `components/ienazo/{BuyButton,PlayLauncher}.tsx`, `components/ienazo/auth/*` |
| DB スキーマ | `supabase/migrations/0001_ienazo_entitlements.sql` |

## 有効化の手順

### 1. Supabase
1. プロジェクトを作成し、**Settings → API** から URL / anon / service role を取得。
2. **SQL Editor** に `supabase/migrations/0001_ienazo_entitlements.sql` を貼って実行。
3. `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   / `SUPABASE_SERVICE_ROLE_KEY` を設定。
4. **Authentication → URL Configuration** の Redirect URLs に
   `http://localhost:3411/ienazo/account/callback` を追加。
   - テスト中は **Email 確認をオフ**にすると登録直後にログイン状態になり確認が速い。

### 2. Stripe（テストモード）
1. `STRIPE_SECRET_KEY`（`sk_test_...`）を設定。価格は `works.ts` の `priceJPY` から
   その場で組む（`stripePriceId` を入れれば固定 Price を使う）。
2. Webhook をローカルに転送：
   ```
   stripe login
   stripe listen --forward-to localhost:3411/api/ienazo/webhook
   ```
   表示される `whsec_...` を `STRIPE_WEBHOOK_SECRET` に設定。

### 3. チケット署名鍵
```
openssl rand -base64 32
```
を `IENAZO_TICKET_SECRET` に設定。

### 4. プレイエンジン
別 Vite SPA をデプロイ後、`NEXT_PUBLIC_IENAZO_ENGINE_BASE_URL` を設定。
未設定のうちは所有検証・チケット発行までは動き、起動だけ「準備中」表示になる。

## 動作確認フロー（実値投入後）
1. `/ienazo/account/register` で登録 → `/ienazo/account/library`。
2. 有料作品の詳細で「購入して遊ぶ」→ Stripe テストカード `4242 4242 4242 4242`。
3. Webhook が `checkout.session.completed` を受けて entitlement を付与。
4. `/ienazo/play/[slug]` で所有確認 →「プレイを開始する」でチケット発行。

> dev: `npx next dev -p 3411`。`.env.local` 変更後は再起動。
