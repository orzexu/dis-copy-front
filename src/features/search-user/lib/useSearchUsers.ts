import { QUERY_KEYS } from "@shared/api"
import { searchUsers } from "@shared/api/user-api"
import { useQuery } from "@tanstack/react-query"

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.searchUsers, query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 5,
  })
}