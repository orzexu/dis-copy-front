import { apiClient, QUERY_KEYS } from "@shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUploadServerIcon = (serverId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post(`/servers/${serverId}/icon`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userServers })
    },
  })
}