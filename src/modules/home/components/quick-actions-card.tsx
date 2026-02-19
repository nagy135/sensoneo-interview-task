import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { CreateProductDialog } from "./create-product-dialog";

export function QuickActionsCard() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-lg">{t("quickActions.title")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <Link to="/products">{t("quickActions.viewAllProducts")}</Link>
          </Button>
          <CreateProductDialog
            trigger={
              <Button>
                <PlusIcon />
                {t("quickActions.addNewProduct")}
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
