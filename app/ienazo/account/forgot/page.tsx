import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotForm } from "@/components/ienazo/auth/ForgotForm";
import { AuthShell } from "@/components/ienazo/auth/AuthShell";

export const metadata: Metadata = {
  title: "パスワード再設定",
  robots: { index: false },
};

export default function ForgotPage() {
  return (
    <AuthShell
      eyebrow="RESET"
      title="パスワード再設定"
      intro="登録済みのメールアドレスに、再設定用のリンクを送ります。"
    >
      <Suspense fallback={null}>
        <ForgotForm />
      </Suspense>
    </AuthShell>
  );
}
