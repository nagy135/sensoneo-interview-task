export type ProductPackaging = "pet" | "can" | "glass" | "tetra" | "other";

export type Product = {
  id: number;
  companyId: number;
  registeredById: number;
  name: string;
  packaging: ProductPackaging;
  deposit: number;
  volume: number;
  registeredAt: string;
  active: boolean;
};

export type CreateProductInput = {
  name: string;
  packaging: ProductPackaging;
  deposit: number;
  volume: number;
  companyId: number;
  registeredById: number;
};

export type ProductsApiResponse = {
  success: true;
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type CreateProductApiResponse = {
  success: true;
  data: Product;
  message: string;
};
