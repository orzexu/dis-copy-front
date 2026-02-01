import { useFriendsStore } from '@entities/friend/model'
import { useAcceptFriendRequest } from '@features/friends/lib'
import { useDeclineFriendRequest } from '@features/friends/lib/useDeclineFriendRequest'
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { Avatar } from '@shared/ui'

export const FriendRequestsList = () => {
	const incomingRequests = useFriendsStore(store => store.incomingRequests)
	const { mutate: acceptFriendRequest } = useAcceptFriendRequest()
	const { mutate: declineFriendRequest } = useDeclineFriendRequest()

	if (incomingRequests.length === 0) {
		return <div className="text-center py-4">No friend requests</div>
	}

	return (
		<div className="flex flex-col p-2 h-full">
			{incomingRequests.map(request => (
				<div
					key={request.id}
					className="flex justify-between items-center p-2 w-full border rounded-md border-zinc-700"
				>
					<div className="flex items-center gap-2">
						<Avatar
							src={request.avatarUrl}
							fallback={request.username}
							isOnline={false}
              size='lg'
						/>
						<div className="text-xl">{request.username}</div>
					</div>
					<div className="flex gap-2">
						<button onClick={() => acceptFriendRequest(request.id)}>
							<CheckIcon className="w-8 h-8 duration-200 hover:scale-115 hover:text-blue-500" />
						</button>
						<button onClick={() => declineFriendRequest(request.id)}>
							<XMarkIcon className="w-8 h-8 duration-200 hover:scale-115 hover:text-red-500" />
						</button>
					</div>
				</div>
			))}
		</div>
	)
}
