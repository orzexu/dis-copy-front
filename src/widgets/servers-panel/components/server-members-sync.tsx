import { useUsersStore } from '@entities/user/model'
import { useServerMembers } from '@features/server/lib'
import { useUiStore } from '@shared/model/ui-store'
import { useEffect } from 'react'

export const ServerMembersSync = () => {
	const selectedServerId = useUiStore(state => state.selectedServerId)
	const { addUsers } = useUsersStore()
	const { data: members } = useServerMembers(selectedServerId)

	useEffect(() => {
		if (members && members.length > 0) {
			addUsers(members)
		}
	}, [members, addUsers])

	return null
}
