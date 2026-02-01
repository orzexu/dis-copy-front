import { TFriend } from '@entities/friend/model'
import { Avatar } from '@shared/ui'

type Props = {
	isConnected: boolean
	isFriendOnline: boolean
	isFriendTyping: boolean
	friend: TFriend | undefined
}

export const ChatHeader = ({
	friend,
	isConnected,
	isFriendOnline,
	isFriendTyping,
}: Props) => {
	return (
		<div className="p-2 border-b border-zinc-700 flex items-center gap-2">
			<Avatar
				src={friend?.avatarUrl}
				fallback={friend?.username}
				isOnline={isFriendOnline}
        size='lg'
			/>
			<div>
				<h2 className="text-zinc-200 font-medium">{friend?.username}</h2>
				<p className="text-xs text-zinc-400">
					{isConnected ? (
						isFriendOnline ? (
							<span className="text-green-400">Online</span>
						) : (
							<span className="text-zinc-500">Offline</span>
						)
					) : (
						<span className="text-yellow-400">Connecting...</span>
					)}
					{isFriendTyping && ' (typing...)'}
				</p>
			</div>
		</div>
	)
}
