'use client';

import { useEffect } from 'react';

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

type Props = {
  slotId: string;
  className?: string;
};

export function AdBanner({ slotId, className = '' }: Props) {
  const isEnabled =
    process.env.NODE_ENV === 'production' &&
    Boolean(PUBLISHER_ID) &&
    Boolean(slotId);

  useEffect(() => {
    if (!isEnabled) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      (w.adsbygoogle ??= []).push({});
    } catch {}
  }, [isEnabled]);

  if (!isEnabled) {
    return (
      <div
        className={`flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-xs text-zinc-400 ${className}`}
      >
        広告プレースホルダー
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
