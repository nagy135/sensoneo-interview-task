import { PageHeader } from "@/components/page-header";
import { useTranslation } from "react-i18next";
import { QuickActionsCard } from "./components/quick-actions-card";
import { MetricsGrid } from "./components/metrics-grid";
import { RecentProductsCard } from "./components/recent-products-card";

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader title={t("home.title")} description={t("home.description")} />
      <MetricsGrid />
      <QuickActionsCard />
      <RecentProductsCard />
    </div>
  );
}
