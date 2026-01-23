import { TFriend, useFriendsStore } from '@entities/friend/model'
import { TrashIcon } from '@heroicons/react/16/solid'
import { useUiStore } from '@shared/model/ui-store'
import React from 'react'

type Props = {
	friend: TFriend
	onMessageClick: (id: number) => void
	onRemoveClick: (id: number) => void
}

export const FriendsListCard = React.memo(
	({ friend, onMessageClick, onRemoveClick }: Props) => {
    const setSelectedFriendId = useFriendsStore(state => state.setSelectedFriendId)
    const setMainPanel = useUiStore(state => state.setMainPanel)

		return (
			<div
				onClick={() => {
          onMessageClick(friend.id)
          setSelectedFriendId(friend.id)
          setMainPanel('pesonalChat')
        }}
				className="flex justify-between items-center px-2 py-4 rounded-md hover:bg-zinc-800 cursor-pointer"
			>
				<div>
					<p className="text-zinc-300">{friend.username}</p>
				</div>
				<button
					onClick={e => {
						e.stopPropagation()
						onRemoveClick(friend.id)
					}}
				>
					<TrashIcon className="w-5 h-5 text-red-400 duration-200 hover:scale-115" />
				</button>
			</div>
		)
	}
)
