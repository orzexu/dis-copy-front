import { useGetFriendRequests } from '@features/friends/lib/useGetFriendRequests'
import { QUERY_KEYS } from '@shared/api'
import { cn } from '@shared/lib'
import { useUiStore } from '@shared/model/ui-store'
import { useQueryClient } from '@tanstack/react-query'

export const FriendsRequestsBlock = () => {
	const isOpenFriendRequests = useUiStore(
		state => state.mainPanel === 'friendRequests',
	)
	const setIsOpenFriendRequests = useUiStore(state => state.setMainPanel)
	const { data: friendRequests, isLoading: isLoadingRequests } =
		useGetFriendRequests()
	const queryClient = useQueryClient()

	const handleToggleFriendRequests = () => {
		if (!isOpenFriendRequests) {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests })
		}
		setIsOpenFriendRequests(isOpenFriendRequests ? null : 'friendRequests')
	}

	return (
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
						'hidden',
				)}
			>
				<p className="text-sm ">{friendRequests?.length}</p>
			</div>
		</div>
	)
}
