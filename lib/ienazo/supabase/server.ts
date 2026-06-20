// サーバー用 Supabase クライアント（Server Component / Route Handler 用）。
// Cookie ベースでセッションを読み書きする（@supabase/ssr 規約）。
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/ienazo/config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Server Component から呼ばれた場合は set が失敗する（読み取り専用）。
        // セッション更新は middleware が担うため、ここでは握りつぶしてよい。
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* noop */
        }
      },
    },
  });
}
