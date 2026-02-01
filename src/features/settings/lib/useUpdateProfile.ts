import { QUERY_KEYS } from "@shared/api"
import { updateProfile } from "@shared/api/user-api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile })
    }
  })
}