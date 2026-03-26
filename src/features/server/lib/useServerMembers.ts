import { QUERY_KEYS } from "@shared/api"
import { getServerMembers } from "@shared/api/server-api"
import { useQuery } from "@tanstack/react-query"

export const useServerMembers = (serverId: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.serverMembers, serverId],
    queryFn: () => getServerMembers(serverId!),
    enabled: !!serverId,
    staleTime: 1000 * 60 * 5,
  });
}