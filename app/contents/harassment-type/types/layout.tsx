import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "16タイプ一覧 | ハラスメントタイプ診断",
  description:
    "ハラスメントタイプ診断の全16タイプを一覧で確認できます。あなたのタイプはどれ？",
};

export default function TypesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
