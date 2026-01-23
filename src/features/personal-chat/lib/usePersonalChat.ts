import { useChatStore } from '@features/personal-chat/model'
import { TMessage } from '@entities/message/model'
import { useAuthStore } from '@entities/user/model'
import { personalChatService } from '@shared/api/personal-chat-socket'
import { useCallback, useEffect, useRef, useState } from 'react'

type UsePersonalChatProps = {
	friendId: number
}

export const usePersonalChat = ({ friendId }: UsePersonalChatProps) => {
	const [input, setInput] = useState('')
	const [isConnected, setIsConnected] = useState(false)
	const [historyLoaded, setHistoryLoaded] = useState(false)

	const currentUser = useAuthStore(state => state.user)
	const currentUserId = currentUser?.id

	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const {
		onlineUsers,
		typingUsers,
		unreadCounts,
		setMessages,
		getMessagesWithFriend,
		resetUnread,
	} = useChatStore()

	const chatMessages = getMessagesWithFriend(friendId)
	const isFriendOnline = onlineUsers.has(friendId)
	const isFriendTyping = typingUsers[friendId] || false
	const unreadCount = unreadCounts[friendId] || 0

  useEffect(() => {
		const container = document.querySelector('.chat-messages')
		if (container) {
			container.scrollTop = container.scrollHeight

			if (chatMessages.length > 0) {
				const hasUnreadFromFriend = chatMessages.some(
					msg => msg.senderId === friendId && !msg.isRead,
				)

				if (hasUnreadFromFriend) {
					personalChatService.markAsRead(friendId)
					resetUnread(friendId)
				}
			}
		}
	}, [chatMessages, friendId])

	// Подключаемся только для загрузки истории
	useEffect(() => {
		const loadHistory = async () => {
			if (!personalChatService.isConnected()) {
				try {
					await personalChatService.connect()
					setIsConnected(true)
				} catch (error) {
					console.error('Failed to connect for history:', error)
					return
				}
			} else {
				setIsConnected(true)
			}

			// Загружаем историю
			personalChatService.getHistoryWithFriend(friendId)
			const handleChatHistory = (data: { messages: TMessage[] }) => {
				setMessages(friendId, data.messages)
				setHistoryLoaded(true)
				personalChatService.markAsRead(friendId)
				resetUnread(friendId)
			}
			personalChatService.onChatHistory(handleChatHistory)

			return () => {
				personalChatService.offChatHistory(handleChatHistory)
			}
		}

		loadHistory()
	}, [friendId])

	const sendMessage = useCallback(() => {
		if (!input.trim() || !isConnected) return

		personalChatService.sendMessageToFriend(friendId, input)
		setInput('')

		// Сбрасываем статус набора
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current)
			typingTimeoutRef.current = null
		}
		personalChatService.sendTypingStatus(friendId, false)
	}, [input, isConnected, friendId])

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				sendMessage()
			}
		},
		[sendMessage],
	)

	const handleInputChange = (value: string) => {
		setInput(value)

		if (!isConnected || !friendId || !currentUserId) return

		const isTyping = value.trim().length > 0

		if (isTyping) {
			personalChatService.sendTypingStatus(friendId, true)

			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current)
			}

			typingTimeoutRef.current = setTimeout(() => {
				personalChatService.sendTypingStatus(friendId, false)
				typingTimeoutRef.current = null
			}, 1000)
		} else {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current)
				typingTimeoutRef.current = null
			}
			personalChatService.sendTypingStatus(friendId, false)
		}
	}

	return {
		// State
		messages: chatMessages,
		isFriendOnline,
		isFriendTyping,
		isConnected,
		historyLoaded,
		input,
		unreadCount,

		// Actions
		setInput: handleInputChange,
		sendMessage,
		handleKeyPress,

		// Utils
		isOwnMessage: (message: TMessage) => message.senderId === currentUserId,
	}
}
