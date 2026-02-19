import { PageHeader } from "@/components/page-header";
import { ProductsTable } from "./components/products-table";
import { useTranslation } from "react-i18next";

export function ProductsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("productsPage.title")}
        description={t("productsPage.description")}
      />
      <ProductsTable />
    </div>
  );
}
