// 管理用 Supabase クライアント（service role キー）。RLS を迂回する。
// ★ サーバー専用。Webhook など信頼済みのサーバー処理からのみ使うこと。
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, clean } from "@/lib/ienazo/config";

export function createAdminClient() {
  const serviceKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!SUPABASE_URL || !serviceKey) {
    throw new Error("Supabase admin client が未設定です（URL / service role key）。");
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
