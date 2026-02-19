import { apiGet, apiPost } from "../lib/api";
import type {
  CreateProductApiResponse,
  CreateProductInput,
  ProductsApiResponse,
} from "./products-types";

type GetProductsParams = {
  page?: number;
  limit?: number;
  active?: boolean;
  sort?: "name" | "registeredAt";
  order?: "asc" | "desc";
};

export function getProducts(params: GetProductsParams) {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.active !== undefined)
    search.set("active", params.active ? "true" : "false");
  if (params.sort) search.set("sort", params.sort);
  if (params.order) search.set("order", params.order);

  const qs = search.toString();
  return apiGet<ProductsApiResponse>(`/api/products${qs ? `?${qs}` : ""}`);
}

export function createProduct(input: CreateProductInput) {
  return apiPost<CreateProductApiResponse>("/api/products", input);
}
