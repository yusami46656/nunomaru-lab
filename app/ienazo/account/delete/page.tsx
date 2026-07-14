import type { Metadata } from "next";
import { Suspense } from "react";
import { DeleteAccountForm } from "@/components/ienazo/auth/DeleteAccountForm";
import { AuthShell } from "@/components/ienazo/auth/AuthShell";

export const metadata: Metadata = {
  title: "アカウント削除",
  robots: { index: false },
};

export default function DeleteAccountPage() {
  return (
    <AuthShell
      eyebrow="DELETE"
      title="アカウント削除"
      intro="アカウントとすべてのデータを削除します。内容をご確認ください。"
    >
      <Suspense fallback={null}>
        <DeleteAccountForm />
      </Suspense>
    </AuthShell>
  );
}
