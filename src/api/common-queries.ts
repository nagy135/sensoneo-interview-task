import { useQuery } from "@tanstack/react-query";
import { getCompanies, getUsers } from "./common-api";

export const commonQueryKeys = {
  companiesAll: () => ["companies", "all"] as const,
  usersAll: () => ["users", "all"] as const,
};

export function useAllCompaniesQuery() {
  return useQuery({
    queryKey: commonQueryKeys.companiesAll(),
    queryFn: getCompanies,
  });
}

export function useAllUsersQuery() {
  return useQuery({
    queryKey: commonQueryKeys.usersAll(),
    queryFn: getUsers,
  });
}
