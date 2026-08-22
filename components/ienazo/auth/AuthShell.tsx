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
      {/* スマホでフォーム全体が1画面に収まるよう、余白は控えめに。
          min-h は 100svh−ヘッダー(h-16)＝URLバー表示時の実効高。
          縦が余る画面では items-center でカードを中央に置く。 */}
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-4xl items-center px-4 py-5 sm:px-6 sm:py-14 lg:py-20">
        <Reveal className="w-full">
          <div className="grid overflow-hidden border border-ienazo-rule bg-ienazo-paper-soft shadow-ienazo-card md:grid-cols-[0.85fr_1fr]">
            {/* ── 左：ヒーローと同じ黒×グレイン。鍵穴ウォーターマーク＋ロゴで世界観を接続 ── */}
            {/* スマホでは縦積みになるため、ロゴ帯として薄く。md 以上で本来の縦長パネルに戻す。 */}
            <div className="relative isolate flex items-center justify-center overflow-hidden bg-ienazo-ink px-6 py-4 text-white md:min-h-[180px] md:px-10 md:py-14">
              <span className="ienazo-grain" aria-hidden />
              <Image
                src="/ienazo/logo_lockup.png"
                alt="家謎"
                width={1139}
                height={450}
                className="relative h-8 w-auto invert md:h-20"
              />
            </div>

            {/* ── 右：セクション見出しと同じ eyebrow＋黒見出し＋フォーム ── */}
            <div className="px-6 py-6 sm:px-10 sm:py-12">
              <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
                <span className="inline-block h-2 w-2 bg-ienazo-ink" aria-hidden />
                {eyebrow}
              </p>
              <h1 className="mt-3 text-2xl font-black tracking-wide sm:mt-4 sm:text-3xl">{title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-ienazo-ink-soft sm:mt-3">{intro}</p>

              {children}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
