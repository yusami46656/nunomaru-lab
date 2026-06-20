import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/ienazo/auth/LoginForm";
import { AuthShell } from "@/components/ienazo/auth/AuthShell";

export const metadata: Metadata = {
  title: "ログイン",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="LOGIN"
      title="ログイン"
      intro="登録済みのメールアドレスでサインインしてください。"
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
