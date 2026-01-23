import { getProfile, QUERY_KEYS } from "@shared/api"
import { useQuery } from "@tanstack/react-query"

export const useGetProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: getProfile,
  })
}