// 家謎バックエンドの設定値（クライアント安全＝公開値のみ）。
// "REPLACE_ME" を含むプレースホルダーは「未設定（undefined）」として扱い、
// UI 側は準備中表示にフォールバックできるようにする。

/** プレースホルダーや空文字を undefined に正規化する。 */
export function clean(v?: string): string | undefined {
  return v && !v.includes("REPLACE_ME") ? v : undefined;
}

export const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3411";

export const SUPABASE_URL = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const ENGINE_BASE_URL = clean(process.env.NEXT_PUBLIC_IENAZO_ENGINE_BASE_URL);

/** Supabase の公開設定がそろっているか（認証 UI の出し分けに使う）。 */
export const supabaseReady = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** ソーシャルログインで出せるプロバイダ。 */
export type OAuthProviderId = "google" | "line" | "twitter";

/** 表示順の正本。env に何を書いても、並びは常にこの順になる。 */
const OAUTH_ORDER: OAuthProviderId[] = ["google", "line", "twitter"];

/**
 * 有効なソーシャルログイン。`NEXT_PUBLIC_IENAZO_OAUTH_PROVIDERS="google,line"` のように指定する。
 * Supabase 側のプロバイダ設定が済んでいないものを書くと、押した瞬間にエラーになる。
 * X を後から足すときは、動作確認のうえ env に `twitter` を追記するだけでよい。
 */
export const OAUTH_PROVIDERS: OAuthProviderId[] = (() => {
  const raw = clean(process.env.NEXT_PUBLIC_IENAZO_OAUTH_PROVIDERS);
  if (!supabaseReady || !raw) return [];
  const wanted = new Set(raw.split(",").map((s) => s.trim().toLowerCase()));
  return OAUTH_ORDER.filter((id) => wanted.has(id));
})();

/**
 * 家謎での呼び名 → Supabase の provider 名。
 *
 * ＊`line` を env に足しても動かない（2026-08-23 に実機で確認済み）。
 *   LINE のウェブログインが返す ID トークンは **HS256**（チャネルシークレットで署名）だが、
 *   LINE の OIDC discovery は `id_token_signing_alg_values_supported: ["ES256"]` と宣言し
 *   ES256 の JWKS を配っている。Supabase は discovery を信じて ES256 で検証するため必ず失敗し、
 *   `Error getting user profile from external provider` になる。
 *   ES256 が返るのはネイティブアプリ／LIFF のときだけで、チャネル設定では切り替えられない。
 *   （userinfo 自体は 200 で正常。壊れているのは ID トークンの検証だけ。）
 *   LINE を通すには Supabase のカスタム OIDC を諦め、認可〜セッション発行を自前で書く必要がある。
 *   チャネル(2011210947)と Supabase 側の custom:line 設定は残してあるので、やるときは再利用できる。
 */
export const SUPABASE_PROVIDER: Record<OAuthProviderId, string> = {
  google: "google",
  line: "custom:line",
  twitter: "twitter",
};
