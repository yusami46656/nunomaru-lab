// プレイ進捗の読み取り（ライブラリ表示用）。
//
// 保存自体はエンジン側が /api/ienazo/progress 経由で行う。ここで見るのは
// 「その作品に続きがあるか」「最後に遊んだのはいつか」の2点だけで、
// data の中身（章・解けた謎）は解釈しない。中身の構造はエンジンの都合で変わるため、
// サイト側がそれに依存すると、エンジンを直すたびにここが壊れる。
//
// ienazo_progress は RLS で本人のみ select 可。テーブル未適用や障害時は
// 「続きなし」に畳む（棚が出せなくなるより、続きの表示だけ落ちるほうが軽い）。
import { createClient } from "@/lib/ienazo/supabase/server";
import { supabaseReady } from "@/lib/ienazo/config";

/** work_slug → 最終プレイ日時(ISO)。続きが無い作品はキーごと入らない。 */
export type LastPlayedMap = Record<string, string>;

export async function loadLastPlayed(userId: string): Promise<LastPlayedMap> {
  if (!supabaseReady) return {};
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ienazo_progress")
      .select("work_slug, updated_at")
      .eq("user_id", userId);
    if (error || !data) return {};
    const map: LastPlayedMap = {};
    for (const row of data) {
      const slug = row.work_slug as string | null;
      const at = row.updated_at as string | null;
      if (slug && at) map[slug] = at;
    }
    return map;
  } catch {
    return {};
  }
}

/** 「2026.08.20」の形にする。日付として読めないものは null。 */
export function formatPlayedAt(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}.${mm}.${dd}`;
}
