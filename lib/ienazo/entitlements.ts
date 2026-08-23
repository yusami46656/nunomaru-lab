// 所有検証ヘルパー（Server Component / Route Handler から使う）。
// 未設定・エラー時は「ログアウト／未所有」に安全側でフォールバックする
// （プレースホルダー運用中でもページが 500 にならないように）。
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/ienazo/supabase/server";
import { supabaseReady } from "@/lib/ienazo/config";

export async function getUser(): Promise<User | null> {
  if (!supabaseReady) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

/**
 * 所有 slug の取得結果。
 * 「1件も持っていない」と「取れなかった」を呼び出し側で区別できるようにする。
 * これを潰すと、DB 障害時に購入済みユーザーへ「まだ購入した作品がありません」と
 * 表示してしまい、買ったものを失ったように見える。
 */
export type OwnedSlugsResult =
  | { ok: true; slugs: string[] }
  | { ok: false; reason: "not_configured" | "signed_out" | "load_failed" };

/** ログイン中ユーザーが所有する作品 slug を、失敗理由つきで取得する。 */
export async function loadOwnedSlugs(): Promise<OwnedSlugsResult> {
  if (!supabaseReady) return { ok: false, reason: "not_configured" };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, reason: "signed_out" };
    const { data, error } = await supabase
      .from("ienazo_entitlements")
      .select("work_slug")
      .eq("user_id", user.id);
    if (error) return { ok: false, reason: "load_failed" };
    return { ok: true, slugs: (data ?? []).map((r) => r.work_slug as string) };
  } catch {
    return { ok: false, reason: "load_failed" };
  }
}

/**
 * ログイン中ユーザーが所有する作品 slug の一覧。
 * 失敗はすべて空配列に畳む安全側の版（所有チェックの既定はこちら）。
 * 失敗を画面に出し分けたいときは loadOwnedSlugs() を使う。
 */
export async function getOwnedSlugs(): Promise<string[]> {
  const result = await loadOwnedSlugs();
  return result.ok ? result.slugs : [];
}

/** 指定作品を所有しているか。 */
export async function hasEntitlement(slug: string): Promise<boolean> {
  const owned = await getOwnedSlugs();
  return owned.includes(slug);
}
