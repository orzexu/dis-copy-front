import { generateServerInvite, QUERY_KEYS } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useGenerateServerInvite = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (serverId: number) => generateServerInvite(serverId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userServers })
		},
	})
}
