import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { useTranslation } from "react-i18next";
import { useRecentActiveProductsQuery } from "../api/home-queries";
import { RecentProductRow } from "./recent-product-row";

export function RecentProductsCard() {
  const { t } = useTranslation();
  const recentProducts = useRecentActiveProductsQuery();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-lg">{t("recentProducts.title")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {recentProducts.isLoading ? (
          <div className="space-y-4 py-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : recentProducts.isError ? (
          <div className="py-6 text-sm text-muted-foreground">
            {t("recentProducts.error")}
          </div>
        ) : recentProducts.data && recentProducts.data.length > 0 ? (
          <div className="divide-y">
            {recentProducts.data.map((p) => (
              <RecentProductRow key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-6 text-sm text-muted-foreground">
            {t("recentProducts.empty")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
