import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/button";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { getProducts } from "@/api/products-api";
import type { Product } from "@/api/products-types";
import { useCompanyNameById, useUserNameById } from "@/hooks";
import {
  formatDepositCents,
  formatPackaging,
  formatShortDate,
  formatVolume,
} from "@/lib/format";
import { CheckCircle, XCircle } from "lucide-react";
import { ProductsFilters, type ActiveFilter } from "./products-filters";
import { ProductsPageSize } from "./products-page-size";
import { ProductsPagination } from "./products-pagination";

const PAGINATION_LIMITS = [10, 20, 50];

export function ProductsTable() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("active");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const queryKey = useMemo(
    () => ["products", { page, limit, active: activeFilter }] as const,
    [page, limit, activeFilter],
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const activeParam =
        activeFilter === "all" ? undefined : activeFilter === "active";
      return getProducts({
        page,
        limit,
        active: activeParam,
        sort: "registeredAt",
        order: "desc",
      });
    },
    placeholderData: (prev) => prev,
  });

  const products: Product[] = query.data?.data ?? [];
  const pagination = query.data?.pagination;

  // hook will get us memoized map of id => name
  const companyNameById = useCompanyNameById();
  const userNameById = useUserNameById();

  function goToPage(p: number) {
    if (!pagination) return;
    const clamped = Math.max(1, Math.min(p, pagination.totalPages));
    setPage(clamped);
  }

  function onChangeActiveFilter(v: ActiveFilter) {
    setActiveFilter(v);
    setPage(1);
  }

  function onChangeLimit(v: number) {
    setLimit(v);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <ProductsFilters value={activeFilter} onChange={onChangeActiveFilter} />

        <div className="flex items-center gap-2">
          <ProductsPageSize
            value={limit}
            onChange={onChangeLimit}
            options={PAGINATION_LIMITS}
          />
          <Button
            variant="outline"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
          >
            <span className="relative inline-block">
              <span className={query.isFetching ? "opacity-0" : undefined}>
                {t("productsTable.refresh")}
              </span>
              {query.isFetching ? (
                <Loader2 className="size-4 animate-spin absolute inset-0 m-auto" />
              ) : null}
            </span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("productsTable.columns.name")}</TableHead>
              <TableHead>{t("productsTable.columns.packaging")}</TableHead>
              <TableHead>{t("productsTable.columns.deposit")}</TableHead>
              <TableHead>{t("productsTable.columns.volume")}</TableHead>
              <TableHead>{t("productsTable.columns.company")}</TableHead>
              <TableHead>{t("productsTable.columns.registeredBy")}</TableHead>
              <TableHead>{t("productsTable.columns.registered")}</TableHead>
              <TableHead className="text-center">
                {t("productsTable.columns.active")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading ? (
              Array.from({ length: Math.min(5, limit) }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell colSpan={8}>
                    <div className="animate-pulse h-5 w-1/2 bg-accent rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="text-center text-sm text-muted-foreground py-6">
                    {t("productsTable.empty")}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{formatPackaging(p.packaging)}</TableCell>
                  <TableCell>{formatDepositCents(p.deposit)}</TableCell>
                  <TableCell>{formatVolume(p.volume)}</TableCell>
                  <TableCell>
                    {companyNameById.get(p.companyId) ?? `#${p.companyId}`}
                  </TableCell>
                  <TableCell>
                    {userNameById.get(p.registeredById) ??
                      `#${p.registeredById}`}
                  </TableCell>
                  <TableCell>{formatShortDate(p.registeredAt)}</TableCell>
                  <TableCell className="text-center">
                    {p.active ? (
                      <span
                        className="inline-flex items-center"
                        title={t("productsTable.status.active")}
                        aria-label={t("productsTable.status.active")}
                      >
                        <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center"
                        title={t("productsTable.status.inactive")}
                        aria-label={t("productsTable.status.inactive")}
                      >
                        <XCircle className="size-5 text-amber-600 dark:text-amber-400" />
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableCaption>
            {pagination
              ? t("productsTable.caption", {
                  current: pagination.currentPage,
                  totalPages: pagination.totalPages,
                  totalItems: pagination.totalItems,
                })
              : null}
          </TableCaption>
        </Table>
      </div>

      {pagination ? (
        <ProductsPagination
          page={page}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            hasNextPage: pagination.hasNextPage,
            hasPreviousPage: pagination.hasPreviousPage,
          }}
          onPageChange={goToPage}
        />
      ) : null}
    </div>
  );
}
