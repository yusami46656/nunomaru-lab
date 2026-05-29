import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * sys-mode (NieR:Automata オマージュ) のページラッパー。
 * body.sys-mode で背景・グリッド・ノイズ・周辺減光を持たせ、
 * このコンポーネントは走査線オーバーレイを fixed で挿入する。
 */
export function NunomaruSystemLayout({ children }: Props) {
  return (
    <>
      <div className="sys-scanlines" aria-hidden />
      <div className="relative z-10">{children}</div>
    </>
  );
}
