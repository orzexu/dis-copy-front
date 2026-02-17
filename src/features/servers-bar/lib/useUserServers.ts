import { QUERY_KEYS } from '@shared/api'
import { getUserServers } from '@shared/api/server-api'
import { useQuery } from '@tanstack/react-query'

export const useUserServers = () => {
	return useQuery({
		queryKey: QUERY_KEYS.userServers,
		queryFn: getUserServers,
	})
}
