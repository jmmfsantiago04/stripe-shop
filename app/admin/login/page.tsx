import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-lumen-line bg-white px-6 py-8">
      <h1 className="text-center font-display text-3xl font-semibold text-lumen-ink">
        Admin
      </h1>
      <p className="mt-2 mb-8 text-center text-sm text-lumen-muted">
        Área restrita da loja demo (portfolio).
      </p>
      <LoginForm />
    </div>
  );
}
