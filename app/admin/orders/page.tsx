import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import { listOrders } from "@/lib/db/orders";
import { formatBRL } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = {
  title: "Pedidos · Admin",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function shortId(id: string) {
  return id.slice(0, 8);
}

export default async function AdminOrdersPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminSessionToken(token)) {
    redirect("/admin/login");
  }

  const orders = await listOrders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Pedidos
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Últimos pedidos gravados pelo webhook do Stripe.
          </p>
        </div>
        <LogoutButton />
      </div>

      {orders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-600">
          Nenhum pedido ainda. Faça um checkout de teste com o webhook ligado.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const itemsLabel = order.items
                  .map((i) => `${i.quantity}× ${i.name}`)
                  .join(", ");

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {shortId(order.id)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="max-w-[12rem] truncate text-sm">
                      {order.customerEmail ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-zinc-700">
                      {itemsLabel || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatBRL(order.amountTotalCents)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}