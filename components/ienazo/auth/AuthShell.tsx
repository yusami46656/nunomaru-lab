import Image from "next/image";
import { Reveal } from "@/components/ienazo/Reveal";

/**
 * 認証ページ（ログイン／会員登録）の共通の殻。
 * トップページと語彙を揃える：
 *   左 = ヒーローと同じ黒×グレイン。家謎ロゴ（家＋鍵穴マーク入り）だけを置く＝ブランドだけで見せる
 *   右 = セクション見出しと同じ eyebrow（インク小四角＋英字ラベル）＋黒の丸ゴシック見出し
 */
export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string; // 英字ラベル "LOGIN" / "REGISTER"
  title: string; // 日本語見出し
  intro: React.ReactNode; // 見出し下の補助文
  children: React.ReactNode; // フォーム
}) {
  return (
    // 地色はレイアウト(bg-ienazo-paper)と同じにして、フッター境目の色段差をなくす。
    // カードは白(paper-soft)＋影＋ヘアライン枠で十分に浮く。
    <div className="bg-ienazo-paper">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="grid overflow-hidden border border-ienazo-rule bg-ienazo-paper-soft shadow-ienazo-card md:grid-cols-[0.85fr_1fr]">
            {/* ── 左：ヒーローと同じ黒×グレイン。鍵穴ウォーターマーク＋ロゴで世界観を接続 ── */}
            <div className="relative isolate flex min-h-[180px] items-center justify-center overflow-hidden bg-ienazo-ink px-8 py-14 text-white sm:px-10">
              <span className="ienazo-grain" aria-hidden />
              <Image
                src="/ienazo/logo_lockup.png"
                alt="家謎"
                width={1139}
                height={450}
                className="relative h-16 w-auto invert sm:h-20"
              />
            </div>

            {/* ── 右：セクション見出しと同じ eyebrow＋黒見出し＋フォーム ── */}
            <div className="px-7 py-10 sm:px-10 sm:py-12">
              <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
                <span className="inline-block h-2 w-2 bg-ienazo-ink" aria-hidden />
                {eyebrow}
              </p>
              <h1 className="mt-4 text-2xl font-black tracking-wide sm:text-3xl">{title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-ienazo-ink-soft">{intro}</p>

              {children}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
