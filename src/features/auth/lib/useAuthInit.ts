import { useEffect, useState } from 'react'
import { useAuthStore } from '@entities/user/model'
import { getProfile } from '@shared/api'
import { ROUTES } from '@app/config'

export const useAuthInit = () => {
	const [isLoading, setIsLoading] = useState(true)
	const { setIsInitialized, login, logout, getIsInitialized, setAccessToken, getAccessToken } =
		useAuthStore()

	useEffect(() => {
		const initAuth = async () => {
			if (getIsInitialized()) {
				setIsLoading(false)
				return
			}

			if (
				location.pathname === ROUTES.login ||
				location.pathname === ROUTES.register
			) {
				setIsInitialized(true)
				setIsLoading(false)
				return
			}

			try {
				const accessToken = getAccessToken()

				if (accessToken) {
          const userData = await getProfile();
          login(userData, accessToken);
        } else {
          logout();
        }
			} catch (error: any) {
				console.error('Auth initialization error:', error)

				if (
					error.response?.status === 401 ||
					error.message === 'Unauthorized'
				) {
					logout()
				} else {
					logout()
				}
			} finally {
				setIsInitialized(true)
				setIsLoading(false)
			}
		}

		initAuth()
	}, [getIsInitialized, setIsInitialized, login, logout, setAccessToken, location.pathname])

	return { isLoading }
}
