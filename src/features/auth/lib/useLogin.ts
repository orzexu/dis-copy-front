import { ROUTES } from '@app/config'
import { useAuthStore, UserResponseDto } from '@entities/user/model'
import { LoginFormData } from '@features/auth/schemas'
import { login } from '@shared/api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

export const useLogin = () => {
	const navigate = useNavigate()
	return useMutation({
		mutationFn: (data: LoginFormData) => login(data),
		onSuccess: res => {
			const {
				accessToken,
				user,
			}: { user: UserResponseDto; accessToken: string } = res.data.data
			useAuthStore.getState().login(user, accessToken)
			navigate(ROUTES.main)
		},
		onError: (error: Error) => {
			console.error('login failed:', error)
		},
	})
}
