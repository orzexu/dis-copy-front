import { useGetFriends, useRemoveFriend } from '@features/friends/lib'
import { useUiStore } from '@shared/model/ui-store'
import { Divider, LoadingSpinner } from '@shared/ui'
import { FriendsListCard } from '@widgets/friends-list/ui/friends-list-card'
import { FriendsRequestsBlock } from '@widgets/friends-list/ui/friends-requests-block'
import { useCallback } from 'react'

export const FriendsList = () => {
	const { isLoading, data: friends, isError } = useGetFriends()
	const setSelectedUserId = useUiStore(state => state.setSelectedUserId)

	const { mutate: removeFriend } = useRemoveFriend()

	const handleSelectFriend = useCallback(
		(friendId: number) => {
			setSelectedUserId(friendId)
		},
		[setSelectedUserId],
	)
	const handleRemoveFriend = useCallback(
		(friendId: number) => {
			removeFriend(friendId)
		},
		[removeFriend],
	)

	if (isLoading) return <LoadingSpinner />
	if (isError) return <div className="text-center py-4 text-red-400">Error</div>

	return (
		<div>
			<FriendsRequestsBlock />
			<Divider />
			{friends?.length === 0 && (
				<div className="text-center py-4 text-zinc-500">No friends</div>
			)}
			<div className="flex flex-col gap-2 overflow-y-hidden">
				{friends?.map(friend => (
					<FriendsListCard
						key={friend.id}
						friend={friend}
						onMessageClick={handleSelectFriend}
						onRemoveClick={handleRemoveFriend}
					/>
				))}
			</div>
		</div>
	)
}
