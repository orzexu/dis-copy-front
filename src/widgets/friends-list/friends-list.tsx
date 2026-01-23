import { useGetFriends, useRemoveFriend } from '@features/friends/lib'
import { useGetFriendRequests } from '@features/friends/lib/useGetFriendRequests'
import { QUERY_KEYS } from '@shared/api'
import { cn } from '@shared/lib'
import { useUiStore } from '@shared/model/ui-store'
import { Divider, LoadingSpinner } from '@shared/ui'
import { useQueryClient } from '@tanstack/react-query'
import { FriendsListCard } from '@widgets/friends-list/ui/friends-list-card'
import { useCallback } from 'react'

type Props = {}

export const FriendsList = ({}: Props) => {
	const { isLoading, data: friends, isError } = useGetFriends()
	const setSelectedUserId = useUiStore(state => state.setSelectedUserId)
	const isOpenFriendRequests = useUiStore(
		state => state.mainPanel === 'friendRequests'
	)
	const setIsOpenFriendRequests = useUiStore(state => state.setMainPanel)
	const { mutate: removeFriend } = useRemoveFriend()
	const { data: friendRequests, isLoading: isLoadingRequests } =
		useGetFriendRequests()
	const queryClient = useQueryClient()

	const handleSelectFriend = useCallback(
		(friendId: number) => {
			setSelectedUserId(friendId)
		},
		[setSelectedUserId]
	)
	const handleRemoveFriend = useCallback(
		(friendId: number) => {
			removeFriend(friendId)
		},
		[removeFriend]
	)
	const handleToggleFriendRequests = () => {
		if (!isOpenFriendRequests) {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests })
		}
		setIsOpenFriendRequests(isOpenFriendRequests ? null : 'friendRequests')
	}

	if (isLoading) return <LoadingSpinner />
	if (isError) return <div className="text-center py-4 text-red-400">Error</div>

	return (
		<div>
			<div
				className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-zinc-800"
				onClick={handleToggleFriendRequests}
			>
				<p className="text-zinc-300">Friend requests</p>
				<div
					className={cn(
						'h-4 w-4 bg-red-400 rounded-full flex items-center justify-center',
						(!friendRequests ||
							isLoadingRequests ||
							friendRequests?.length === 0) &&
							'hidden'
					)}
				>
					<p className="text-sm ">{friendRequests?.length}</p>
				</div>
			</div>
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
