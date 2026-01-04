import { UserResponseDto } from "@entities/user/model"
import { apiClient } from "@shared/api/axios-instance"

export const getProfile = async (): Promise<UserResponseDto> => {
  const response = await apiClient.get('/users/profile')
  return response.data.data
}