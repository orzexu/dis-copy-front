import { ROUTES } from '@app/config'
import { useAuthStore, UserResponseDto } from '@entities/user/model'
import { RegisterFormData } from '@features/auth/schemas'
import { register } from '@shared/api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

export const useRegister = () => {
	const navigate = useNavigate()
	return useMutation({
		mutationFn: (data: RegisterFormData) => register(data),
		onSuccess: res => {
			const {
				user,
				accessToken,
			}: { user: UserResponseDto; accessToken: string } = res.data.data
			useAuthStore.getState().login(user, accessToken)
			navigate(ROUTES.main)
		},
		onError: (error: Error) => {
			console.error('register failed:', error)
		},
	})
}
