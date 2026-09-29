"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onLogout() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={onLogout}
      className="rounded-full border-lumen-line bg-white text-lumen-ink hover:border-lumen-blue hover:bg-lumen-blue-soft hover:text-lumen-blue"
    >
      {pending ? "Saindo…" : "Sair"}
    </Button>
  );
}
