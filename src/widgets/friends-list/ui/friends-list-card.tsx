import { TFriend, useFriendsStore } from '@entities/friend/model'
import { useChatStore } from '@features/personal-chat/model'
import { TrashIcon } from '@heroicons/react/16/solid'
import { useUiStore } from '@shared/model/ui-store'
import { Avatar, UnreadCount } from '@shared/ui'
import React from 'react'

type Props = {
	friend: TFriend
	onMessageClick: (id: number) => void
	onRemoveClick: (id: number) => void
}

export const FriendsListCard = React.memo(
	({ friend, onMessageClick, onRemoveClick }: Props) => {
		const setSelectedFriendId = useFriendsStore(
			state => state.setSelectedFriendId,
		)
		const setMainPanel = useUiStore(state => state.setMainPanel)
		const onlineUsers = useChatStore(state => state.onlineUsers)
		const isFriendOnline = onlineUsers.has(friend.id)
		const unreadCount = useChatStore(
			state => state.unreadCounts[friend.id] || 0,
		)

		return (
			<div
				onClick={() => {
					onMessageClick(friend.id)
					setSelectedFriendId(friend.id)
					setMainPanel('pesonalChat')
				}}
				className="flex justify-between items-center px-2 py-1 rounded-md hover:bg-zinc-800 cursor-pointer"
			>
				<div className="flex items-center gap-2">
					<Avatar
						src={friend.avatarUrl}
						fallback={friend.username}
						isOnline={isFriendOnline}
            size='lg'
					/>
					<div>
						<p className="text-zinc-300 text-lg">{friend.username}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<UnreadCount count={unreadCount} />
					<button
						onClick={e => {
							e.stopPropagation()
							onRemoveClick(friend.id)
						}}
					>
						<TrashIcon className="w-5 h-5 text-red-400 duration-200 hover:scale-115" />
					</button>
				</div>
			</div>
		)
	},
)
