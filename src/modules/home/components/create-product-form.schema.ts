import { z } from "zod";

import type { ProductPackaging } from "@/api/products-types";
import { preprocessNumber } from "@/lib/utils";

import type { Translate } from "@/i18n/i18n";

export const packagingValues: ProductPackaging[] = [
  "pet",
  "can",
  "glass",
  "tetra",
  "other",
];

export const createProductSchema = (t: Translate) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t("createProduct.validation.nameRequired"))
      .max(200, t("createProduct.validation.nameTooLong")),
    packaging: z.enum(packagingValues),
    deposit: z.preprocess(
      preprocessNumber,
      z
        .number({
          error: t("createProduct.validation.depositNumber"),
        })
        .int(t("createProduct.validation.depositInteger"))
        .min(0, t("createProduct.validation.depositMin")),
    ),
    volume: z.preprocess(
      preprocessNumber,
      z
        .number({
          error: t("createProduct.validation.volumeNumber"),
        })
        .int(t("createProduct.validation.volumeInteger"))
        .min(1, t("createProduct.validation.volumeMin")),
    ),
    companyId: z.preprocess(
      preprocessNumber,
      z
        .number({
          error: t("createProduct.validation.companyIdNumber"),
        })
        .int(t("createProduct.validation.companyIdInteger"))
        .min(1, t("createProduct.validation.companyIdMin")),
    ),
    registeredById: z.preprocess(
      preprocessNumber,
      z
        .number({
          error: t("createProduct.validation.registeredByNumber"),
        })
        .int(t("createProduct.validation.registeredByInteger"))
        .min(1, t("createProduct.validation.registeredByMin")),
    ),
  });

export type CreateProductFormValues = z.infer<
  ReturnType<typeof createProductSchema>
>;
