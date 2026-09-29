"use client";

import { formatBRL } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type OrderDetailItem = {
  id: string;
  name: string;
  quantity: number;
  unitAmountCents: number;
};

export type OrderDetailData = {
  id: string;
  createdAt: string;
  customerEmail: string | null;
  status: string;
  amountTotalCents: number;
  items: OrderDetailItem[];
};

function statusLabel(status: string) {
  if (status === "paid") return "Pago";
  return status;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function OrderDetailDialog({ order }: { order: OrderDetailData }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 rounded-full border border-lumen-line bg-white px-3 text-xs text-lumen-ink hover:border-lumen-blue hover:bg-lumen-blue-soft hover:text-lumen-blue"
          />
        }
      >
        Ver
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-2xl border border-lumen-line bg-white p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold text-lumen-ink">
            Pedido {order.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-lumen-muted">
            <span>{formatDate(order.createdAt)}</span>
            <span className="truncate">{order.customerEmail ?? "—"}</span>
            <Badge
              variant="secondary"
              className="border-lumen-blue/20 bg-lumen-blue-soft text-lumen-blue"
            >
              {statusLabel(order.status)}
            </Badge>
          </div>

          <ul className="divide-y divide-lumen-line rounded-xl border border-lumen-line">
            {order.items.length === 0 ? (
              <li className="px-3 py-2 text-lumen-muted">Sem itens</li>
            ) : (
              order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-lumen-ink">{item.name}</p>
                    <p className="text-xs text-lumen-muted">
                      {item.quantity} × {formatBRL(item.unitAmountCents)}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium text-lumen-ink">
                    {formatBRL(item.unitAmountCents * item.quantity)}
                  </p>
                </li>
              ))
            )}
          </ul>

          <p className="text-right text-sm font-semibold text-lumen-ink">
            Total {formatBRL(order.amountTotalCents)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
