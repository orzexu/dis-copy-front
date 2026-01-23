import { declineFriendRequest, QUERY_KEYS } from "@shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeclineFriendRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: declineFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.searchUsers] })
    },
    onError: error => {
      console.error('declineFriendRequest failed:', error)
    }
  })
}