// ブラウザ用 Supabase クライアント（Client Component から呼ぶ）。
// supabaseReady が true のときだけ生成すること。
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/ienazo/config";

export function createClient() {
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
