import { useEffect } from 'react'
import { personalChatService } from '@shared/api/personal-chat-socket'
import { useAuthStore } from '@entities/user/model'
import { useChatStore } from '@features/personal-chat/model'

export const useGlobalSocket = () => {
	const accessToken = useAuthStore(state => state.accessToken)
	const currentUser = useAuthStore(state => state.user)
	const currentUserId = currentUser?.id

	const {
		addMessage,
		setOnline,
		setOffline,
		setTyping,
		resetUnread,
    markMessagesAsRead
	} = useChatStore()

	useEffect(() => {
		if (!accessToken || !currentUserId) return

		personalChatService.connect().catch(error => {
			console.error('Socket connection failed:', error)
		})

		personalChatService.onMessage(message => {
			const currentUserId = useAuthStore.getState().user?.id

			let friendId: number
			if (message.senderId === currentUserId) {
				friendId = message.receiverId
			} else {
				friendId = message.senderId
			}

			addMessage(friendId, message)
		})

		personalChatService.onUserOnline(userId => {
			setOnline(userId, true)
		})

		personalChatService.onUserOffline(userId => {
			setOffline(userId)
		})

		personalChatService.onTypingStatus(data => {
			if (data.senderId !== currentUserId) {
				setTyping(data.senderId, data.isTyping)
			}
		})

		personalChatService.onMessagesMarkedAsRead(data => {
			resetUnread(data.friendId)
      markMessagesAsRead(data.friendId)
		})

		return () => {
			personalChatService.disconnect()
		}
	}, [accessToken, currentUserId])
}
