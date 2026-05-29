import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "診断中 | ハラスメントタイプ診断",
  description:
    "ハラスメントタイプ診断の設問ページです。全16問に答えて、あなたのタイプを判定します。",
};

export default function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
