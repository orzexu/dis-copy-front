import { SearchUsersDto, UserResponseDto } from '@entities/user/model'
import { apiClient } from '@shared/api/axios-instance'

export const getProfile = async (): Promise<UserResponseDto> => {
	const response = await apiClient.get('/users/profile')
	return response.data.data
}

export const searchUsers = async (query: string): Promise<SearchUsersDto[]> => {
	const response = await apiClient.get<{ data: SearchUsersDto[] }>(
		'/users/search',
		{
			params: { q: query },
		}
	)
	return response.data.data
}
