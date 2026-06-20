import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/ienazo/auth/RegisterForm";
import { AuthShell } from "@/components/ienazo/auth/AuthShell";

export const metadata: Metadata = {
  title: "会員登録",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="REGISTER"
      title="会員登録"
      intro="メールアドレスとパスワードだけで登録できます。"
    >
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
