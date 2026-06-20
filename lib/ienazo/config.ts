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
