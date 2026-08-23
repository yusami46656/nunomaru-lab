# 家謎 認証メール テンプレート

Supabase Auth が送る認証メールの本文。**正本はこのディレクトリ**で、Supabase
ダッシュボードには手で貼り付ける（Supabase 側にテンプレートを同期する API を
このプロジェクトでは使っていないため）。

貼付先: Supabase → Authentication → **Emails** → Templates

| ファイル | ダッシュボードの項目 | 件名 |
|---|---|---|
| `confirm-signup.html` | Confirm sign up | 【家謎】メールアドレスのご確認 |
| `reset-password.html` | Reset password | 【家謎】パスワード再設定のご案内 |
| `change-email-address.html` | Change email address | 【家謎】メールアドレス変更のご確認 |

`_previous/` は差し替え前の版（2026-08-23 取得）。表示がおかしくなったら
この中身をそのまま貼り戻せば元に戻る。

## 前提としている設定値

文面に実数や仕様を書いているので、Supabase 側を変えたらここも直すこと。

| 設定 | 現在値 | 文面への影響 |
|---|---|---|
| Email OTP expiration | **3600 秒（1時間）** | 「有効期限は、発行から1時間です」 |
| Secure email change | **ON** | 「変更前と変更後の両方のアドレスで承認が必要」 |
| Site URL | `https://www.nunomaru-lab.com` | `{{ .SiteURL }}` の展開先。ロゴ・規約リンクもこのドメイン |
| Sender email | `noreply@nunomaru-lab.com` | 「送信専用アドレスからお送りしています」 |
| Sender name | `家謎` | — |

## リンクの作り方（触るときの注意）

- **登録確認・パスワード再設定**は `token_hash` 方式。
  `{{ .SiteURL }}/ienazo/account/callback?token_hash={{ .TokenHash }}&type=...&next=...`
  を `app/ienazo/account/callback/route.ts` が `verifyOtp` でセッションに交換する。
  この形だと登録した端末と別の端末でリンクを開いてもログインできる。
  `{{ .ConfirmationURL }}` に変えるとその挙動が壊れるので変更しないこと。
- **メールアドレス変更だけ** `{{ .ConfirmationURL }}` を使う。Secure email change が
  ON で変更前・変更後の両アドレスに別トークンのメールが飛ぶため、`{{ .TokenHash }}` に
  どちらのトークンが入るかが保証できない。Supabase が受信者ごとに正しく組み立てる
  `{{ .ConfirmationURL }}` に任せるのが安全。そのぶんリンク先が `supabase.co`
  ドメインになるので、本文には生 URL を載せず「アカウント設定からやり直す」導線を置いている。

## 組版のルール

- `table` レイアウト＋インライン CSS のみ。`<style>` ブロックと flex/grid は使わない（Outlook が落ちる）。
- 幅は `width="600"` 属性＋`max-width:600px`。属性は Outlook 用、CSS は他クライアント用。
- 配色は `tailwind.config.ts` の `ienazo` テーマから。地 `#f7f6f2` ／ 面 `#ffffff` ／
  文字 `#181818` ／ 補助 `#5e5c55` ／ ヘアライン `#dcd9d0` `#e4e2da` ／ 差し色 `#a23a35`。
- フォントは Zen Maru Gothic が使えない（メールで Web フォントは効かない）ため
  `Hiragino Maru Gothic ProN → Hiragino Kaku Gothic ProN → Yu Gothic Medium → Meiryo`。
  Mac / iOS ではサイトと同じ丸ゴシックになる。
- ロゴは画像がブロックされても読めるよう、`alt` に文字サイズ・太さ・色を当ててある。

## プレビュー

```
python supabase/email-templates/build-preview.py
```

`_preview.html` が生成される（Go テンプレート変数をダミー値に置換して3通を縦に並べたもの）。
ブラウザで開いて組版を確認する。**このファイルはダッシュボードには貼らない。**

## 積み残し

- ロゴは `public/ienazo/logo_lockup.png`（1139×450 / 約 270KB / 背景透過）をそのまま
  参照している。メール用に白背景で焼き込んだ 400px 程度の軽い版を作れば、
  読み込みが速くなり、ダークモードで反転するクライアントでもロゴが消えない。
  差し替えるときは**先にサイトをデプロイ**してからテンプレートの `src` を変えること。
- Security 通知（Password changed / Email address changed）はダッシュボードで
  OFF のまま。ON にすると不正利用の気づきが早くなるので、有効化するならこの体裁で
  テンプレートを足す。
