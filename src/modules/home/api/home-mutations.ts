import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateProductInput } from "@/api/products-types";
import { createProduct } from "@/api/products-api";

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const res = await createProduct(input);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
