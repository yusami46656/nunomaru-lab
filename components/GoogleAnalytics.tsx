'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type WindowWithDataLayer = Window & { dataLayer: unknown[] };

function gtag(...args: unknown[]) {
  const w = window as unknown as WindowWithDataLayer;
  w.dataLayer ??= [];
  w.dataLayer.push(args);
}

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID) return;
    gtag('event', 'page_view', { page_path: pathname });
  }, [pathname]);

  if (process.env.NODE_ENV !== 'production' || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
