import { QUERY_KEYS, sendFriendRequest } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useSendFriendRequest = () => {
	const queryClient = useQueryClient()
  
	return useMutation({
		mutationFn: (targetId: number) => sendFriendRequest(targetId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friends })
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.searchUsers] })
		},
		onError: error => {
			console.error('sendFriendRequest failed:', error)
		},
	})
}
