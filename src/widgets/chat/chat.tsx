import { usePersonalChat } from '@features/personal-chat/lib/usePersonalChat'
import { useFriendsStore } from '@entities/friend/model/friends-store'
import { ChatInput } from '@shared/ui'
import { cn } from '@shared/lib'
import { CheckIcon } from '@heroicons/react/16/solid'
import { ChatHeader } from '@widgets/chat/ui/chat-header'

type Props = {}

export const ChatWidget = ({}: Props) => {
	const friendId = useFriendsStore(state => state.selectedFriendId)

	if (!friendId) {
		return <div className="p-4 text-zinc-500">Select a friend to chat</div>
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
				{!historyLoaded ? (
					<div className="flex items-center justify-center h-full">
						<div className="text-zinc-500">Loading chat history...</div>
					</div>
				) : messages.length === 0 ? (
					<div className="flex items-center justify-center h-full">
						<div className="text-zinc-500">No messages yet</div>
					</div>
				) : (
					<div className="space-y-3">
						{messages.map((msg, index) => (
							<div
								key={msg.id || index}
								className={cn(
									'max-w-max p-2 rounded-lg flex gap-1 relative',
									msg.senderId === friendId
										? 'bg-zinc-700 mr-auto'
										: 'bg-zinc-800 ml-auto',
								)}
							>
								<p
									className={cn(
										'text-white text-sm',
										msg.senderId === friendId ? 'pr-8' : 'pr-14',
									)}
								>
									{msg.content}
								</p>
								<p
									className={cn(
										'text-xs text-zinc-400 mt-1 w-max absolute bottom-1',
										msg.senderId === friendId ? 'right-1' : 'right-6',
									)}
								>
									{new Date(msg.createdAt).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
								<CheckIcon
									className={cn(
										'w-4 h-4 absolute right-1 bottom-1',
										msg.senderId === friendId ? 'hidden' : 'block',
										msg.isRead ? 'text-green-400' : 'text-gray-400',
									)}
								/>
							</div>
						))}
					</div>
				)}
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
