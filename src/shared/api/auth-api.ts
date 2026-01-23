import { LoginFormData, RegisterFormData } from '@features/auth/schemas'
import { apiClient } from '@shared/api/axios-instance'
import { refreshClient } from '@shared/api/refresh-client'

export const login = async (data: LoginFormData) => {
	return apiClient.post('/auth/login', data)
}

export const register = async (data: RegisterFormData) => {
	return apiClient.post('/auth/register', data)
}

export const refreshAccessToken = async () => {
	return refreshClient.post('/auth/refresh')
}

export const logout = async () => {
	return apiClient.post('/auth/logout')
}
