import { permanentRedirect } from "next/navigation";

// 旧プレイゲートは廃止。所有確認と「プレイを開始する」は作品紹介ページ（WorkCta）に集約したため、
// このパスへのアクセスは作品紹介ページへ恒久リダイレクトする（既存リンク・ブックマーク救済）。
export default async function PlayGateRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/ienazo/works/${slug}`);
}
