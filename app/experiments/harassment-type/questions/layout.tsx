import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ハラスメントタイプ診断 設問",
  description:
    "ハラスメントタイプ診断の設問ページです。現在は仮実装で、簡易な設問のみを表示しています。",
};

export default function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
