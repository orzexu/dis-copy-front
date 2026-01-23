import { useFriendsStore } from '@entities/friend/model'
import { useGlobalSocket } from '@shared/lib'
import { useUiStore } from '@shared/model/ui-store'
import { Divider } from '@shared/ui'
import { ChatWidget } from '@widgets/chat'
import { FriendRequestsList } from '@widgets/friend-requests'
import { FriendsList } from '@widgets/friends-list'
import { SearchUsersBar } from '@widgets/search-users-bar'
import { UserFooterProfile } from '@widgets/user-footer-profile'
import { useCallback, useEffect } from 'react'

export const MainPage = () => {
  useGlobalSocket()
	const selectedFriendId = useFriendsStore(state => state.selectedFriendId)
	const setSelectedFriendId = useFriendsStore(
		state => state.setSelectedFriendId,
	)
  const mainPanel = useUiStore(state => state.mainPanel)
	const setMainPanel = useUiStore(state => state.setMainPanel)

	const handleClearMainPanel = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setMainPanel(null)
				setSelectedFriendId(null)
			}
		},
		[setMainPanel, setSelectedFriendId],
	)

	useEffect(() => {
		document.addEventListener('keydown', handleClearMainPanel)
		return () => {
			document.removeEventListener('keydown', handleClearMainPanel)
		}
	}, [handleClearMainPanel])

  const showFriendRequests = mainPanel === 'friendRequests';
  const showChat = selectedFriendId !== null ;

	return (
		<div className="flex h-screen w-full p-1">
			<div className="flex flex-col justify-between p-1">
				<div className="flex flex-1">
					<div className="p-1 min-w-12">{/* TODO: servers table */}</div>

					<Divider type="vertical" />
					<div className="p-2 min-w-2xs flex flex-col justify-between relative">
						{/* SEARCH USERS */}
						<SearchUsersBar />

						<Divider type="horizontal" />

						{/* MIDDLE PANEL */}
						<div className="flex-1">
							<FriendsList />
						</div>
					</div>
				</div>

				{/* FOOTER PROFILE + SETTINGS PANEL */}
				<UserFooterProfile />
			</div>

			{/* MAIN PANEL */}
			<div className="p-1 flex-1">
				{showFriendRequests ? (
          <FriendRequestsList />
        ) : showChat ? (
          <ChatWidget />
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500">
            Select a friend to start chatting
          </div>
        )}
			</div>
		</div>
	)
}
