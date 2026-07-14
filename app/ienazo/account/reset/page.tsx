import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetForm } from "@/components/ienazo/auth/ResetForm";
import { AuthShell } from "@/components/ienazo/auth/AuthShell";

export const metadata: Metadata = {
  title: "新しいパスワードの設定",
  robots: { index: false },
};

export default function ResetPage() {
  return (
    <AuthShell
      eyebrow="RESET"
      title="新しいパスワード"
      intro="新しいパスワードを設定すると、そのままログインします。"
    >
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
