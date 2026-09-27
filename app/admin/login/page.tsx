import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-zinc-900">
        Admin
      </h1>
      <p className="mt-2 mb-8 text-center text-sm text-zinc-600">
        Área restrita da loja demo (portfolio).
      </p>
      <LoginForm />
    </div>
  );
}