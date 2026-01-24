import { TMessage } from '@entities/message/model'
import { useAuthStore } from '@entities/user/model'
import { refreshAccessToken } from '@shared/api/auth-api'
import { io, Socket } from 'socket.io-client'

class PesonalChatService {
	private socket: Socket | null = null
	private baseUrl = import.meta.env.VITE_SOCKET_BASE_URL

	private onMessageCallback: ((message: TMessage) => void) | null = null
	private onFriendOnlineCallback: ((userId: number) => void) | null = null
	private onFriendOfflineCallback: ((userId: number) => void) | null = null
	private onTypingStatusCallback:
		| ((data: { senderId: number; isTyping: boolean }) => void)
		| null = null
	private onChatHistoryCallback:
		| ((data: { messages: TMessage[] }) => void)
		| null = null
	private onMessageMarkedAsReadCallback: ((data: { friendId: number }) => void) | null = null

	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			const token = useAuthStore.getState().accessToken

			if (!token) {
				reject(new Error('Access token is not found'))
				return
			}

			this.disconnect()

			this.socket = io(`${this.baseUrl}`, {
				auth: { token },
				transports: ['websocket'],
			})

			this.socket.on('connect', () => {
				console.log('connected in personal chat')
				resolve()
			})

			this.socket.on('connect_error', error => {
				console.log('connect error', error)
				reject(error)
			})

			this.socket.on('newMessage', (message: TMessage) => {
				if (this.onMessageCallback) {
					this.onMessageCallback(message)
				}
			})
			this.socket.on('userOnline', (data: { userId: number }) => {
				if (this.onFriendOnlineCallback) {
					this.onFriendOnlineCallback(data.userId)
				}
			})

			this.socket.on('userOffline', (data: { userId: number }) => {
				if (this.onFriendOfflineCallback) {
					this.onFriendOfflineCallback(data.userId)
				}
			})

			this.socket.on('tokenExpired', () => {
				console.log('Токен истек')
				this.refreshTokenAndReconnect()
			})
		})
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect()
			this.socket = null
			this.onMessageCallback = null
			this.onFriendOnlineCallback = null
			this.onFriendOfflineCallback = null
			this.onTypingStatusCallback = null
			this.onChatHistoryCallback = null
			this.onMessageMarkedAsReadCallback = null
		}
	}

	sendMessageToFriend(receiverId: number, content: string): void {
		if (!this.socket?.connected) {
			console.error('Socket is not connected')
			return
		}
		console.log(`Sending message to ${receiverId}:`, content)
		this.socket.emit('sendMessage', { receiverId, content })
	}
	getHistoryWithFriend(friendId: number): void {
		if (!this.socket?.connected) return
		this.socket.emit('getChatHistory', { otherUserId: friendId })
	}
	onMessage(callback: (message: TMessage) => void): void {
		this.onMessageCallback = callback
	}
	onUserOnline(callback: (userId: number) => void): void {
		this.onFriendOnlineCallback = callback
	}
	onUserOffline(callback: (userId: number) => void): void {
		this.onFriendOfflineCallback = callback
	}
	private async refreshTokenAndReconnect(): Promise<void> {
		try {
			const response = await refreshAccessToken()

			if (response.status === 200) {
				const data = await response.data.data
				useAuthStore.getState().setAccessToken(data.accessToken)
				await this.connect()
			} else {
				useAuthStore.getState().logout()
				window.location.href = '/login'
			}
		} catch (error) {
			console.error('can not refresh token', error)
		}
	}

	isConnected(): boolean {
		return this.socket?.connected || false
	}

	onTypingStatus(
		callback: (data: { senderId: number; isTyping: boolean }) => void
	): void {
		if (this.onTypingStatusCallback) {
			this.socket?.off('onTypingStatus', this.onTypingStatusCallback)
		}
		this.onTypingStatusCallback = callback
		this.socket?.on('onTypingStatus', callback)
	}

  sendTypingStatus(recipientId: number, isTyping: boolean): void {
    if (!this.socket?.connected) return
    this.socket.emit('onTypingStatus', { recipientId, isTyping })
  }

	checkUserOnline(
		userId: number
	): Promise<{ userId: number; isOnline: boolean }> {
		return new Promise(resolve => {
			this.socket?.emit('checkOnline', userId, resolve)
		})
	}

	markAsRead(senderId: number): void {
		if (!this.socket?.connected) return
		this.socket.emit('markAsRead', { senderId })
	}

	onChatHistory(callback: (data: { messages: TMessage[] }) => void): void {
		if (this.onChatHistoryCallback) {
			this.socket?.off('chatHistory', this.onChatHistoryCallback)
		}
		this.onChatHistoryCallback = callback
		this.socket?.on('chatHistory', callback)
	}

	offChatHistory(callback: (data: { messages: TMessage[] }) => void): void {
		this.socket?.off('chatHistory', callback)
	}

	onMessagesMarkedAsRead(
  callback: (data: { friendId: number }) => void
): void {
  if (this.onMessageMarkedAsReadCallback) {
    this.socket?.off('messagesMarkedAsRead', this.onMessageMarkedAsReadCallback);
  }
  this.onMessageMarkedAsReadCallback = callback;
  this.socket?.on('messagesMarkedAsRead', callback);
}


	offMessagesMarkedAsRead(callback: (data: { senderId: number }) => void): void {
  this.socket?.off('messagesMarkedAsRead', callback);
}

	clearChatSubscriptions(): void {
		if (this.socket) {
			if (this.onMessageCallback) {
				this.socket.off('newMessage', this.onMessageCallback)
			}
			if (this.onFriendOnlineCallback) {
				this.socket.off('userOnline', this.onFriendOnlineCallback)
			}
			if (this.onFriendOfflineCallback) {
				this.socket.off('userOffline', this.onFriendOfflineCallback)
			}
			if (this.onTypingStatusCallback) {
				this.socket.off('onTypingStatus', this.onTypingStatusCallback)
			}
			if (this.onChatHistoryCallback) {
				this.socket.off('chatHistory', this.onChatHistoryCallback)
			}
			if (this.onMessageMarkedAsReadCallback) {
				this.socket.off(
					'messagesMarkedAsRead',
					this.onMessageMarkedAsReadCallback
				)
			}
		}
	}
}

export const personalChatService = new PesonalChatService()
