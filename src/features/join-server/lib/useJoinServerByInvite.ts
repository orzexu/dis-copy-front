import { joinServerByInvite, QUERY_KEYS } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useJoinServerByInvite = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (inviteCode: string) => joinServerByInvite(inviteCode),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userServers })
		},
	})
}
