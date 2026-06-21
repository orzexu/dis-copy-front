import { QUERY_KEYS, updateServer } from "@shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateServer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userServers })
    },
  })
}