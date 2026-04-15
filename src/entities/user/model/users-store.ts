import { create } from 'zustand'

type TUser = {
	id: number
	username: string
	avatarUrl?: string | null
}

type UsersStore = {
	users: Record<number, TUser>

	// Действия
	addUser: (user: TUser) => void
	addUsers: (users: TUser[]) => void
	getUserById: (id: number) => TUser | undefined
	getUserByName: (username: string) => TUser | undefined
}

export const useUsersStore = create<UsersStore>((set, get) => ({
	users: {},

	addUser: user =>
		set(state => ({
			users: {
				...state.users,
				[user.id]: user,
			},
		})),

	addUsers: users =>
		set(state => {
			const nextUsers = { ...state.users }

			users.forEach(user => {
				nextUsers[user.id] = user
			})

			return { users: nextUsers }
		}),

	getUserById: id => get().users[id],

	getUserByName: username => Object.values(get().users).find(user => user.username === username),
}))
