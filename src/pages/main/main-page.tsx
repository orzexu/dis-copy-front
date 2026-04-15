import { useFriendsStore } from '@entities/friend/model'
import { useGlobalSocket } from '@shared/lib'
import { useUiStore } from '@shared/model/ui-store'
import { Divider } from '@shared/ui'
import { ServerContent } from '@widgets/server-content'
import { ChatWidget } from '@widgets/chat'
import { FriendRequestsList } from '@widgets/friend-requests'
import { FriendsList } from '@widgets/friends-list'
import { SearchUsersBar } from '@widgets/search-users-bar'
import { ServersList } from '@widgets/servers-panel'
import { UserFooterProfile } from '@widgets/user-footer-profile'
import { useCallback, useEffect } from 'react'
import { ChannelTextChat } from '@widgets/channel-text-chat'
import { ChannelVoiceChat } from '@widgets/channel-voice-chat'

export const MainPage = () => {
	useGlobalSocket()

	const selectedFriendId = useFriendsStore(state => state.selectedFriendId)
	const setSelectedFriendId = useFriendsStore(
		state => state.setSelectedFriendId,
	)

	const mainPanel = useUiStore(state => state.mainPanel)
	const setMainPanel = useUiStore(state => state.setMainPanel)
	const middlePanel = useUiStore(state => state.middlePanel)

	const selectedServerId = useUiStore(state => state.selectedServerId)
	const selectedChannelId = useUiStore(state => state.selectedChannelId)

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

	const showFriendRequests = mainPanel === 'friendRequests'
	const showChat = selectedFriendId !== null && mainPanel === 'pesonalChat'
	const showFriends = selectedServerId === null && middlePanel === 'friends'
	const showServerContent =
		selectedServerId !== null && middlePanel === 'channels'
	const showChannelTextChat =
		selectedChannelId !== null && mainPanel === 'channelTextChat'
	const showChannelVoiceChat =
		selectedChannelId !== null && mainPanel === 'channelVoiceChat'

	return (
			<div className="flex h-screen w-full p-1">
				<div className="flex flex-col justify-between">
					<div className="flex flex-1">
						<div className="min-w-12 pr-0.5">
							{/* SERVERS */}
							<ServersList />
						</div>

						<Divider type="vertical" />
						<div className="p-2 min-w-2xs flex flex-col justify-between relative">
							{/* SEARCH USERS */}
							<SearchUsersBar />

							<Divider type="horizontal" />

							{/* MIDDLE PANEL */}
							<div className="flex-1">
								{showFriends ? (
									<FriendsList />
								) : (
									showServerContent && <ServerContent />
								)}
							</div>
						</div>
					</div>

					{/* FOOTER PROFILE + SETTINGS PANEL */}
					<UserFooterProfile />
				</div>

				{/* MAIN PANEL */}
				<div className="flex-1 pl-1">
					{showFriendRequests ? (
						<FriendRequestsList />
					) : showChat ? (
						<ChatWidget />
					) : showChannelTextChat ? (
						<ChannelTextChat />
					) : showChannelVoiceChat ? (
						<ChannelVoiceChat roomName={`channel_${selectedChannelId}`} />
					) : (
						<div className="h-full flex items-center justify-center text-zinc-500">
							Select a friend to start chatting
						</div>
					)}
				</div>
			</div>
	)
}
