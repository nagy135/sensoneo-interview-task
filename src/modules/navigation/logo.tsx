import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Logo() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center justify-center h-14 mr-8 text-2xl font-bold text-gray-900">
      <Package className="mr-2 text-blue-500 size-7" />
      {t("app.name")}
    </div>
  );
}
