import { useUiStore } from '@shared/model/ui-store'
import { cn } from '@shared/lib'
import { useChannelChat } from '@features/channel-chat/lib'
import { Avatar, ChatInput, LoadingSpinner } from '@shared/ui'
import { useUserServers } from '@features/servers-bar/lib'

export const ChannelTextChat = () => {
	const { data: server } = useUserServers()
	const selectedChannelId = useUiStore(state => state.selectedChannelId)
	const selectedServerId = useUiStore(state => state.selectedServerId)
	const selectedServer = server?.find(s => s.id === selectedServerId)
	const selectedChannel = selectedServer?.channels.find(
		c => c.id === selectedChannelId,
	)

	if (!selectedChannelId) {
		return (
			<div className="flex h-full items-center justify-center text-zinc-500">
				Select a channel to start chatting
			</div>
		)
	}

	const {
		messages,
		input,
		setInput,
		sendMessage,
		handleKeyPress,
		isOwnMessage,
		isConnected,
		historyLoaded,
	} = useChannelChat({ channelId: selectedChannelId })

	if (!isConnected || !historyLoaded) {
		return (
			<div className="flex flex-col h-full items-center justify-center text-zinc-500">
				<LoadingSpinner />
				<div>Loading messages</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full border border-zinc-700  rounded-lg">
			{/* Header */}
			<div className="h-12 border-b border-zinc-800 flex items-center px-4 shadow-sm">
				<span className="text-zinc-400 mr-2">#</span>
				<h2 className="font-bold text-white">{selectedChannel?.name}</h2>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 channel-chat-messages">
				{messages.length === 0 ? (
					<div className="text-zinc-500 text-center mt-10">
						No messages yet. Be the first to say hi!
					</div>
				) : (
					messages.map(msg => (
						<div
							key={msg.id}
							className={cn(
								'flex gap-3 group',
								isOwnMessage(msg) ? 'flex-row-reverse' : 'flex-row',
							)}
						>
							{/* Avatar Placeholder */}
								<Avatar
									fallback={msg.sender.username}
									src={msg.sender.avatarUrl}
								/>
							<div className="flex flex-col max-w-[70%]">
								{/* Sender Name & Time */}
								<div className="flex items-baseline gap-2 mb-1">
									<span className="font-semibold text-white text-sm">
										{msg.sender.username}
									</span>
									<span className="text-xs text-zinc-500">
										{new Date(msg.createdAt).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
								</div>

								{/* Message Content */}
								<div
									className={cn(
										'px-3 py-2 rounded-lg text-sm wrap-break-words whitespace-pre-wrap',
										isOwnMessage(msg)
											? 'bg-zinc-700 text-white rounded-tr-none'
											: 'bg-zinc-800 text-zinc-100 rounded-tl-none',
									)}
								>
									{msg.content}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Input Area */}
			<div className="p-2 border-t border-zinc-800">
				<ChatInput
					placeholder={`Message to ${selectedChannel?.name}`}
					value={input}
					onChange={e => setInput(e.target.value)}
					sendDisabled={!input.trim()}
          onKeyDown={handleKeyPress}
					onSend={sendMessage}
				/>
			</div>
		</div>
	)
}
