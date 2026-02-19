import { useMemo } from "react";
import { useAllUsersQuery } from "../api/common-queries";

export function useUserNameById() {
  const usersQuery = useAllUsersQuery();
  const map = useMemo(() => {
    const m = new Map<number, string>();
    for (const u of usersQuery.data?.data ?? [])
      m.set(u.id, `${u.firstName} ${u.lastName}`);
    return m;
  }, [usersQuery.data]);
  return map;
}
