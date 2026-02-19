import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { useTranslation } from "react-i18next";

type ProductsPageSizeProps = {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  size?: "sm" | "default";
};

export function ProductsPageSize({
  value,
  onChange,
  options = [10, 20, 50],
  size = "sm",
}: ProductsPageSizeProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t("productsPageSize.rowsPerPage")}
      </span>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger size={size}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
