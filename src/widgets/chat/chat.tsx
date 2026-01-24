import { usePersonalChat } from '@features/personal-chat/lib/usePersonalChat'
import { useFriendsStore } from '@entities/friend/model/friends-store'
import { ChatInput } from '@shared/ui'
import { ChatHeader } from '@widgets/chat/ui/chat-header'
import { ChatMessages } from '@widgets/chat/ui/chat-messages'

export const ChatWidget = () => {
	const friendId = useFriendsStore(state => state.selectedFriendId)

	if (!friendId) {
		return (
			<div className="p-4 h-full text-zinc-500 flex items-center justify-center">
				Select a friend to chat
			</div>
		)
	}

	const {
		messages,
		input,
		setInput,
		sendMessage,
		handleKeyPress,
		isConnected,
		historyLoaded,
		isFriendOnline,
		isFriendTyping,
	} = usePersonalChat({ friendId })

	const friend = useFriendsStore(state =>
		state.friends.find(f => f.id === friendId),
	)

	return (
		<div className="flex flex-col h-full rounded-lg border border-zinc-700">
			<ChatHeader
				friend={friend}
				isConnected={isConnected}
				isFriendOnline={isFriendOnline}
				isFriendTyping={isFriendTyping}
			/>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-3 chat-messages">
				<ChatMessages
					friendId={friendId}
					historyLoaded={historyLoaded}
					messages={messages}
				/>
			</div>

			{/* Input */}
			<div className="p-3 border-t border-zinc-700">
				<ChatInput
					placeholder="Type a message..."
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={handleKeyPress}
					disabled={!isConnected}
					onSend={sendMessage}
					sendDisabled={!input.trim() || !isConnected}
				/>
			</div>
		</div>
	)
}
