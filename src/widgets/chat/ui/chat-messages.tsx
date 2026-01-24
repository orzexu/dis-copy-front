import { TMessage } from '@entities/message/model'
import { CheckIcon } from '@heroicons/react/16/solid'
import { cn } from '@shared/lib'

type Props = {
	friendId: number
	historyLoaded: boolean
	messages: TMessage[]
}

export const ChatMessages = ({ friendId, historyLoaded, messages }: Props) => {
	return (
		<>
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
		</>
	)
}
