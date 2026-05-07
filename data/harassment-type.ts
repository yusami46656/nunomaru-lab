/**
 * ハラスメントタイプ診断のデータ構造。
 *
 * 仮実装。ロジックは未実装で、回答後は固定の sample 結果ページに遷移するのみ。
 * 将来的に ~28問へ拡張する想定。設問を追加するときは LIKERT_OPTIONS を変えずに
 * questions 配列に push すればよい。
 */

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export type LikertOption = {
  value: LikertValue;
  label: string;
};

export const LIKERT_OPTIONS: ReadonlyArray<LikertOption> = [
  { value: 1, label: "まったく当てはまらない" },
  { value: 2, label: "あまり当てはまらない" },
  { value: 3, label: "どちらともいえない" },
  { value: 4, label: "やや当てはまる" },
  { value: 5, label: "とても当てはまる" },
];

/** 将来 16タイプのスコアリングに使う軸を識別するためのキー(仮)。 */
export type Axis = "power" | "moral" | "sexual" | "customer";

export type HarassmentQuestion = {
  id: string;
  /** 設問文。 */
  text: string;
  /** どの軸に効く設問か。仮実装では未使用だが、将来の集計で利用する。 */
  axis?: Axis;
  /** 逆転項目フラグ。スコアリング実装時に使用する。 */
  reversed?: boolean;
};

/**
 * 仮の質問。本番ではここを ~28問に拡張する。
 * 設問の追加・並び替えは配列を編集するだけでよい。
 */
export const harassmentQuestions: HarassmentQuestion[] = [
  {
    id: "q1",
    text: "後輩の仕事のやり方が非効率だと、ついその場で正しいやり方を細かく指導したくなる。",
    axis: "power",
  },
  {
    id: "q2",
    text: "相手の機嫌が悪そうな時、原因を相手の人格や性格に結びつけて考えてしまうことがある。",
    axis: "moral",
  },
  {
    id: "q3",
    text: "自分が客の立場の時、店員に対して「サービスとしては当然」と感じる要求を強めにしてしまうことがある。",
    axis: "customer",
  },
];
