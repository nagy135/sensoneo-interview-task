import { useMemo } from "react";
import { useAllCompaniesQuery } from "../api/common-queries";

export function useCompanyNameById() {
  const companiesQuery = useAllCompaniesQuery();
  const map = useMemo(() => {
    const m = new Map<number, string>();
    for (const c of companiesQuery.data?.data ?? []) m.set(c.id, c.name);
    return m;
  }, [companiesQuery.data]);
  return map;
}
