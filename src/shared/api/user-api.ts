import { SearchUsersDto, UserResponseDto } from '@entities/user/model'
import { PersonalDataFormData } from '@features/settings/schemas'
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

export const updateProfile = async (data: PersonalDataFormData) => {
  const response = await apiClient.patch('/users/profile', data)
  return response.data.data
}
