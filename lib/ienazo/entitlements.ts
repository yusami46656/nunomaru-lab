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

/** ログイン中ユーザーが所有する作品 slug の一覧。 */
export async function getOwnedSlugs(): Promise<string[]> {
  if (!supabaseReady) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from("ienazo_entitlements")
      .select("work_slug")
      .eq("user_id", user.id);
    if (error) return [];
    return (data ?? []).map((r) => r.work_slug as string);
  } catch {
    return [];
  }
}

/** 指定作品を所有しているか。 */
export async function hasEntitlement(slug: string): Promise<boolean> {
  const owned = await getOwnedSlugs();
  return owned.includes(slug);
}
