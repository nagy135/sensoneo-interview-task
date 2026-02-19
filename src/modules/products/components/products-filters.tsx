import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { useTranslation } from "react-i18next";

export type ActiveFilter = "all" | "active" | "inactive";

type ProductsFiltersProps = {
  value: ActiveFilter;
  onChange: (value: ActiveFilter) => void;
};

export function ProductsFilters({ value, onChange }: ProductsFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t("productsFilters.statusLabel")}
      </span>
      <Select value={value} onValueChange={(v) => onChange(v as ActiveFilter)}>
        <SelectTrigger>
          <SelectValue placeholder={t("productsFilters.statusPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("productsFilters.options.all")}
          </SelectItem>
          <SelectItem value="active">
            {t("productsFilters.options.active")}
          </SelectItem>
          <SelectItem value="inactive">
            {t("productsFilters.options.inactive")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
