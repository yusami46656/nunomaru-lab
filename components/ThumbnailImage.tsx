'use client';

import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  sizes?: string;
  imageClassName?: string;
};

export function ThumbnailImage({
  src,
  alt,
  sizes,
  imageClassName = "object-cover transition duration-500 group-hover:scale-[1.02]",
}: Props) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <ThumbnailPlaceholder />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={imageClassName}
      onError={() => setHasError(true)}
    />
  );
}

function ThumbnailPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-parchment-200">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(154, 109, 62, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(154, 109, 62, 0.18) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative flex flex-col items-center gap-1 text-brass-700/70">
        <svg viewBox="0 0 100 100" aria-hidden className="h-10 w-10">
          <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.7" />
          <line x1="50" y1="18" x2="50" y2="6" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="94" x2="50" y2="82" stroke="currentColor" strokeWidth="2" />
          <line x1="6" y1="50" x2="18" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="82" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="font-serif text-xs tracking-[0.25em] text-brass-700/70">EXPERIMENT</span>
      </div>
    </div>
  );
}
