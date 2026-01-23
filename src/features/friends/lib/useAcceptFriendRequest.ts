import { acceptFriendRequest, QUERY_KEYS } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAcceptFriendRequest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: acceptFriendRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friends })
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests })
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.searchUsers] })
		},
		onError: error => {
			console.error('acceptFriendRequest failed:', error)
		},
	})
}
