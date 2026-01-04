import { logout } from '@shared/api'
import { UserResponseDto } from './types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthState = {
	//---data---
	user: UserResponseDto | null
	accessToken: string | null
	isInitialized: boolean

	//---methods---
	login: (user: UserResponseDto, accessToken: string) => void
	logout: () => void
	setAccessToken: (token: string) => void
	setUser: (user: AuthState['user']) => void
	setIsInitialized: (value: boolean) => void

	//---getters---
	isAuthenticated: () => boolean
	getAccessToken: () => string | null
	getUser: () => UserResponseDto | null
	getIsInitialized: () => boolean
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			accessToken: null,
			isInitialized: false,
			//---methods---
			logout: async () => {
				try {
					await logout()
				} catch (e) {
					console.error('Logout error:', e)
				} finally {
					set({ user: null, accessToken: null, isInitialized: true })
					localStorage.removeItem('auth-storage')
				}
			},
			login: (user, accessToken) => {
				set({ user, accessToken, isInitialized: true })
			},
			setAccessToken: token => {
				set({ accessToken: token })
			},
			setUser: user => set({ user }),
			setIsInitialized: value => set({ isInitialized: value }),
			//---getters---
			isAuthenticated: () => {
				const state = get()
				return state.accessToken !== null && state.user !== null
			},
			getAccessToken: () => get().accessToken,
			getUser: () => get().user,
			getIsInitialized: () => get().isInitialized,
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: state => ({
				user: state.user,
				accessToken: state.accessToken,
				isInitialized: state.isInitialized,
			}),
		}
	)
)
