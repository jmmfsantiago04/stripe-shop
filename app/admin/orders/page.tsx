import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import {
  listOrders,
  parseOrderSort,
  type OrderSort,
} from "@/lib/db/orders";
import {
  isProductCategoryId,
  type ProductCategoryId,
} from "@/lib/categories";
import { CategoryFilter } from "./category-filter";
import { OrderDetailDialog } from "./order-detail-dialog";
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
  title: "Pedidos — Admin",
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

type PageProps = {
  searchParams: Promise<{
    sort?: string;
    category?: string;
    q?: string;
  }>;
};

const SORT_OPTIONS: { value: OrderSort; label: string }[] = [
  { value: "date_desc", label: "Data · mais recente" },
  { value: "date_asc", label: "Data · mais antiga" },
  { value: "total_desc", label: "Total · maior" },
  { value: "total_asc", label: "Total · menor" },
];

function adminOrdersHref(opts: {
  sort?: OrderSort;
  category?: ProductCategoryId;
  q?: string;
}) {
  const params = new URLSearchParams();

  if (opts.sort && opts.sort !== "date_desc") {
    params.set("sort", opts.sort);
  }
  if (opts.category) {
    params.set("category", opts.category);
  }
  if (opts.q && opts.q.trim()) {
    params.set("q", opts.q.trim());
  }

  const qs = params.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

function statusLabel(status: string) {
  if (status === "paid") return "Pago";
  return status;
}

function chipClass(active: boolean) {
  return active
    ? "rounded-full border border-lumen-ink bg-lumen-ink px-2.5 py-1 text-xs font-medium text-lumen-cream"
    : "rounded-full border border-lumen-line bg-white px-2.5 py-1 text-xs font-medium text-lumen-muted hover:border-lumen-ink/30 hover:text-lumen-ink";
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminSessionToken(token)) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const sort = parseOrderSort(params.sort);
  const rawCategory = params.category;
  const category =
    rawCategory && isProductCategoryId(rawCategory)
      ? rawCategory
      : undefined;
  const q = params.q?.trim() || undefined;

  const orders = await listOrders({
    limit: 50,
    sort,
    category,
    q,
  });

  const hasFilters = Boolean(category || q);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-2 rounded-full bg-lumen-amber"
            />
            <h1 className="font-display text-3xl font-semibold tracking-tight text-lumen-ink">
              Pedidos
            </h1>
          </div>
          <p className="mt-1 text-sm text-lumen-muted">
            {orders.length}{" "}
            {orders.length === 1 ? "resultado" : "resultados"}
            {hasFilters ? " com filtros" : ""}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mb-6 space-y-3 rounded-2xl border border-lumen-line bg-white/70 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-lumen-muted">
            Ordenar
          </span>
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={adminOrdersHref({ sort: opt.value, category, q })}
              className={chipClass(opt.value === sort)}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-lumen-line pt-3">
          <CategoryFilter sort={sort} category={category} q={q} />

          <form
            method="get"
            action="/admin/orders"
            className="flex flex-wrap items-center gap-2"
          >
            {sort !== "date_desc" ? (
              <input type="hidden" name="sort" value={sort} />
            ) : null}
            {category ? (
              <input type="hidden" name="category" value={category} />
            ) : null}
            <label htmlFor="admin-q" className="sr-only">
              Buscar e-mail
            </label>
            <input
              id="admin-q"
              name="q"
              type="search"
              defaultValue={q ?? ""}
              placeholder="E-mail…"
              className="h-8 w-44 rounded-full border border-lumen-line bg-white px-3 text-sm text-lumen-ink outline-none placeholder:text-lumen-muted focus:border-lumen-blue sm:w-52"
            />
            <button
              type="submit"
              className="h-8 rounded-full bg-lumen-blue px-3 text-xs font-medium text-white hover:opacity-90"
            >
              Buscar
            </button>
            {q ? (
              <Link
                href={adminOrdersHref({ sort, category })}
                className="inline-flex h-8 items-center rounded-full border border-lumen-line bg-white px-3 text-xs font-medium text-lumen-ink hover:border-lumen-blue hover:bg-lumen-blue-soft hover:text-lumen-blue"
              >
                Limpar
              </Link>
            ) : null}
          </form>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-lumen-line bg-white px-6 py-12 text-center">
          <h2 className="font-display text-xl font-semibold text-lumen-ink">
            {hasFilters ? "Nenhum pedido com esses filtros" : "Nenhum pedido ainda"}
          </h2>
          <p className="mt-2 text-sm text-lumen-muted">
            {hasFilters
              ? "Tente ajustar a busca, a categoria ou limpar os filtros."
              : "Quando houver checkouts pagos, eles aparecem aqui."}
          </p>
          {hasFilters ? (
            <Link
              href="/admin/orders"
              className="mt-5 inline-flex h-9 items-center rounded-full bg-lumen-blue px-4 text-sm font-medium text-white hover:opacity-90"
            >
              Limpar filtros
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-lumen-line bg-white shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="border-lumen-line hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wide text-lumen-muted">
                  Pedido
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-lumen-muted">
                  Data
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-lumen-muted">
                  E-mail
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-lumen-muted">
                  Itens
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-lumen-muted">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide text-lumen-muted">
                  Total
                </TableHead>
                <TableHead className="w-[1%] text-right">
                  <span className="sr-only">Detalhe</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const itemCount = order.items.reduce(
                  (sum, i) => sum + i.quantity,
                  0,
                );

                return (
                  <TableRow
                    key={order.id}
                    className="border-lumen-line hover:bg-lumen-cream/40"
                  >
                    <TableCell className="font-mono text-xs text-lumen-ink">
                      {shortId(order.id)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-lumen-muted">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="max-w-[12rem] truncate text-sm text-lumen-ink">
                      {order.customerEmail ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-lumen-muted">
                      {itemCount === 1 ? "1 item" : `${itemCount} itens`}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="border-lumen-blue/20 bg-lumen-blue-soft text-lumen-blue"
                      >
                        {statusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-lumen-ink">
                      {formatBRL(order.amountTotalCents)}
                    </TableCell>
                    <TableCell className="text-right">
                      <OrderDetailDialog
                        order={{
                          id: order.id,
                          createdAt: order.createdAt.toISOString(),
                          customerEmail: order.customerEmail,
                          status: order.status,
                          amountTotalCents: order.amountTotalCents,
                          items: order.items.map((i) => ({
                            id: i.id,
                            name: i.name,
                            quantity: i.quantity,
                            unitAmountCents: i.unitAmountCents,
                          })),
                        }}
                      />
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
