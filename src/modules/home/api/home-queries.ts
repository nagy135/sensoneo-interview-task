import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/api/products-api";
import { getCompanies, getUsers } from "../../../api/common-api";

export const homeQueryKeys = {
  productsCount: (active: boolean) =>
    ["products", "count", { active }] as const,
  companiesCount: () => ["companies", "count"] as const,
  usersCount: () => ["users", "count"] as const,
  recentProducts: () => ["products", "recent", { active: true }] as const,
};

export function useActiveProductsCountQuery() {
  return useQuery({
    queryKey: homeQueryKeys.productsCount(true),
    queryFn: async () => {
      const res = await getProducts({ active: true, limit: 1, page: 1 });
      return res.pagination.totalItems;
    },
  });
}

export function usePendingProductsCountQuery() {
  return useQuery({
    queryKey: homeQueryKeys.productsCount(false),
    queryFn: async () => {
      const res = await getProducts({ active: false, limit: 1, page: 1 });
      return res.pagination.totalItems;
    },
  });
}

export function useCompaniesCountQuery() {
  return useQuery({
    queryKey: homeQueryKeys.companiesCount(),
    queryFn: async () => {
      const res = await getCompanies();
      return res.total;
    },
  });
}

export function useUsersCountQuery() {
  return useQuery({
    queryKey: homeQueryKeys.usersCount(),
    queryFn: async () => {
      const res = await getUsers();
      return res.total;
    },
  });
}

export function useRecentActiveProductsQuery() {
  return useQuery({
    queryKey: homeQueryKeys.recentProducts(),
    queryFn: async () => {
      const res = await getProducts({
        active: true,
        sort: "registeredAt",
        order: "desc",
        limit: 5,
        page: 1,
      });
      return res.data;
    },
  });
}
