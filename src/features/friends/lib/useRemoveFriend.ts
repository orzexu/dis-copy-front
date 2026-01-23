import { QUERY_KEYS, removeFriend } from "@shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useRemoveFriend = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.searchUsers] })
    },
    onError: (error) => {
      console.error('removeFriend failed:', error)
    }
  })
}