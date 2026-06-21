import { useAuthStore } from '@entities/user/model'
import { apiClient, QUERY_KEYS } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUploadAvatar = () => {
	const queryClient = useQueryClient()
	const setUser = useAuthStore(state => state.setUser)

	return useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData()
			formData.append('file', file)
			const response = await apiClient.post('/users/avatar', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			return response.data.data
		},
		onSuccess: updatedUser => {
			setUser(updatedUser)
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile })
		},
	})
}
