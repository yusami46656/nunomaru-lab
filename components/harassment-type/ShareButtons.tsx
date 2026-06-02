"use client";

import { useState } from "react";
import { buildShareText } from "@/lib/harassment-type/share";
import type { HarassmentType } from "@/data/harassment-type";
import type { PercentScores } from "@/lib/harassment-type/scoring";

type Props = {
  typeData: HarassmentType;
  scores: PercentScores | null;
};

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function ShareButtons({ typeData, scores }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getResultUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const getShareText = () => {
    const url = getResultUrl();
    const label = `${typeData.attributesLabel} ${typeData.name}`;
    if (scores) return buildShareText(typeData.name, typeData.attributesLabel, scores, url);
    return `私のハラスメントタイプは「${label}」でした\n\n#ハラスメントタイプ診断\n${url}`;
  };

  const handleX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLine = () => {
    const url = `https://line.me/R/share?text=${encodeURIComponent(getShareText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFacebook = () => {
    const url =
      `https://www.facebook.com/sharer/sharer.php` +
      `?u=${encodeURIComponent(getResultUrl())}` +
      `&quote=${encodeURIComponent(getShareText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleInstagram = async () => {
    const imagePath = `/contents/harassment-type/share/${typeData.id}.png`;

    // Web Share API（モバイル共有シート）
    if (typeof navigator !== "undefined" && navigator.canShare) {
      try {
        const res = await fetch(imagePath);
        if (res.ok) {
          const blob = await res.blob();
          const file = new File([blob], `${typeData.id}.png`, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            showToast("共有シートを開きました。Instagramストーリーズを選んで投稿してください");
            await navigator.share({ files: [file] });
            showToast("画像を共有しました。Instagram側で投稿を完了してください");
            return;
          }
        }
      } catch {
        // フォールバックへ
      }
    }

    // フォールバック: 画像ダウンロード（PC・非対応ブラウザ）
    try {
      const a = document.createElement("a");
      a.href = imagePath;
      a.download = `${typeData.id}.png`;
      a.click();
    } catch {
      // 画像未配置の場合は無視
    }
    showToast("画像を保存しました。Instagramストーリーズで投稿してください");
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getResultUrl());
      showToast("URLをコピーしました");
    } catch {
      // clipboard 利用不可
    }
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white text-center">
          {toast}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleX} className="share-btn bg-black text-white">
          <XIcon />
          X
        </button>
        <button type="button" onClick={handleLine} className="share-btn bg-[#06C755] text-white">
          <LineIcon />
          LINE
        </button>
        <button type="button" onClick={handleFacebook} className="share-btn bg-[#1877F2] text-white">
          <FacebookIcon />
          Facebook
        </button>
        <button
          type="button"
          onClick={handleInstagram}
          className="share-btn text-white"
          style={{ background: "linear-gradient(45deg, #833AB4, #FD1D1D, #FCAF45)" }}
        >
          <InstagramIcon />
          Instagram
        </button>
      </div>
      <button type="button" onClick={handleCopyUrl} className="ht-btn-ghost">
        URLをコピー
      </button>
    </div>
  );
}
