import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { harassmentTypes } from "@/data/harassment-type";
import ResultContent from "./ResultContent";

type Props = { params: Promise<{ typeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { typeId } = await params;
  const typeData = harassmentTypes.find((t) => t.id === typeId);
  if (!typeData) return {};

  const title = `あなたは「${typeData.name}」| ハラスメントタイプ診断`;
  const description = typeData.caption;
  const ogImage = `/contents/harassment-type/og/${typeId}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function HarassmentResultPage({ params }: Props) {
  const { typeId } = await params;
  const typeData = harassmentTypes.find((t) => t.id === typeId);
  if (!typeData) notFound();
  return <ResultContent typeData={typeData} />;
}
