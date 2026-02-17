import { QUERY_KEYS } from '@shared/api'
import { createServer } from '@shared/api/server-api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateServer = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: createServer,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userServers })
		},
	})
}
