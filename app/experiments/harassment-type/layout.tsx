"use client";

import { useEffect } from "react";

export default function HarassmentTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("ht-page");
    return () => {
      document.body.classList.remove("ht-page");
    };
  }, []);

  return <>{children}</>;
}
