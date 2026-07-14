"use client";

// 有料作品の CTA を所有状態で出し分ける。
// ページ自体は静的のまま保ち、マウント後に所有判定APIを叩いて切り替える。
// 既定（判定中・未ログイン・未所有）は「購入する」。所有者だけ「PLAY」に差し替わる。
// ＝匿名/未所有が大多数の販売ページで、既定表示に遅延を出さない方針。
//
// ログイン/ログアウトやブラウザの戻る(bfcache)で判定が陳腐化しないよう、
// 認証状態の変化と pageshow に追随して再判定する（非所有者に押せるボタンを残さない）。
import { useEffect, useState } from "react";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";
import { BuyButton } from "./BuyButton";
import { PlayLauncher } from "./PlayLauncher";

export function WorkCta({ slug }: { slug: string }) {
  const [owned, setOwned] = useState(false);

  useEffect(() => {
    let alive = true;

    async function check() {
      try {
        const r = await fetch(`/api/ienazo/entitlement?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const d = await r.json();
        if (alive) setOwned(Boolean(d?.owned));
      } catch {
        if (alive) setOwned(false); // 判定失敗時は購入ボタンのまま（安全側）
      }
    }

    check();

    // ログアウトは即 false、ログイン/トークン更新時は再判定。
    let unsubscribe = () => {};
    if (supabaseReady) {
      const supabase = createClient();
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") {
          if (alive) setOwned(false);
        } else {
          check();
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    }

    // ブラウザの戻る/進む（bfcache 復帰）でも再判定。
    const onPageShow = () => check();
    window.addEventListener("pageshow", onPageShow);

    return () => {
      alive = false;
      unsubscribe();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [slug]);

  if (owned) {
    return <PlayLauncher slug={slug} mode="owned" label="PLAY" />;
  }
  return <BuyButton slug={slug} />;
}
