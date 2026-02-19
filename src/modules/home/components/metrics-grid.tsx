import { Building2, CircleDashed, MilkIcon, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  useActiveProductsCountQuery,
  useCompaniesCountQuery,
  usePendingProductsCountQuery,
  useUsersCountQuery,
} from "../api/home-queries";
import { MetricCard } from "./metric-card";

export function MetricsGrid() {
  const { t } = useTranslation();

  const activeProducts = useActiveProductsCountQuery();
  const pendingProducts = usePendingProductsCountQuery();
  const companies = useCompaniesCountQuery();
  const users = useUsersCountQuery();

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title={t("metrics.activeProducts.title")}
        description={t("metrics.activeProducts.description")}
        value={activeProducts.data}
        isLoading={activeProducts.isLoading}
        icon={MilkIcon}
      />
      <MetricCard
        title={t("metrics.pendingProducts.title")}
        description={t("metrics.pendingProducts.description")}
        value={pendingProducts.data}
        isLoading={pendingProducts.isLoading}
        icon={CircleDashed}
      />
      <MetricCard
        title={t("metrics.companies.title")}
        description={t("metrics.companies.description")}
        value={companies.data}
        isLoading={companies.isLoading}
        icon={Building2}
      />
      <MetricCard
        title={t("metrics.users.title")}
        description={t("metrics.users.description")}
        value={users.data}
        isLoading={users.isLoading}
        icon={Users}
      />
    </section>
  );
}
