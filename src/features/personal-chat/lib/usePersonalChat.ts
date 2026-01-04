import { TMessage } from '@entities/message/model'
import { useAuthStore } from '@entities/user/model'
import { personalChatService } from '@shared/api'
import { useCallback, useEffect, useState } from 'react'

type UsePersonalChatProps = {
	friendId: number
}

export const usePersonalChat = ({ friendId }: UsePersonalChatProps) => {
	const [messages, setMessages] = useState<TMessage[]>([])
	const [isFriendOnline, setIsFriendOnline] = useState<boolean>(false)
	const [isConnected, setIsConnected] = useState<boolean>(false)
	const [input, setInput] = useState('')

	const currentUser = useAuthStore(state => state.user)

	const connect = useCallback(async () => {
		try {
			await personalChatService.connect()
			setIsConnected(true)

			personalChatService.onMessage(message => {
				if (message.senderId === friendId || message.receiverId === friendId) {
					setMessages(prev => [...prev, message])
				}
			})

			personalChatService.onFriendOnline(userId => {
				if (userId === friendId) {
					setIsFriendOnline(true)
				}
			})

			personalChatService.onFriendOffline(userId => {
				if (userId === friendId) {
					setIsFriendOnline(false)
				}
			})

			personalChatService.getHistoryWhithFriend(friendId)
		} catch (error) {
			console.error('can not connect to personal chat', error)
		}
	}, [friendId])

	const sendMessage = useCallback(() => {
		if (!input.trim() || !isConnected) return

		personalChatService.sendMessageToFriend(friendId, input)
		setInput('')
	}, [input, isConnected, friendId])

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				sendMessage()
			}
		},
		[sendMessage]
	)

	useEffect(() => {
		connect()

		return () => {
			personalChatService.disconnect()
		}
	}, [connect])

	const chatMessages = messages.filter(
		msg =>
			(msg.senderId === friendId && msg.receiverId === currentUser?.id) ||
			(msg.senderId === currentUser?.id && msg.receiverId === friendId)
	)

	return {
		messages: chatMessages,
		isFriendOnline,
		isConnected,
		input,

		setInput,
		sendMessage,
		handleKeyPress,

		isOwnMessage: (message: TMessage) => message.senderId === currentUser?.id,
	}
}
