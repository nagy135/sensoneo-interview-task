import type { Product } from "@/api/products-types";
import { useTranslation } from "react-i18next";
import {
  formatDepositCents,
  formatPackaging,
  formatShortDate,
  formatVolume,
} from "@/lib/format";

type RecentProductRowProps = {
  product: Product;
};

export function RecentProductRow({ product }: RecentProductRowProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="min-w-0">
        <div className="truncate font-medium">{product.name}</div>
        <div className="mt-1 text-sm text-muted-foreground">
          {formatVolume(product.volume)}
          <span className="mx-2">•</span>
          {formatDepositCents(product.deposit)} {t("products.depositNoun")}
          <span className="mx-2">•</span>
          {formatPackaging(product.packaging)}
        </div>
      </div>
      <div className="shrink-0 text-sm text-muted-foreground">
        {formatShortDate(product.registeredAt)}
      </div>
    </div>
  );
}
