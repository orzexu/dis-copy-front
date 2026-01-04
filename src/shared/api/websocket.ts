import { TMessage } from '@entities/message/model'
import { useAuthStore } from '@entities/user/model'
import { refreshAccessToken } from '@shared/api/auth-api'
import { io, Socket } from 'socket.io-client'

class PesonalChatService {
	private socket: Socket | null = null
	private baseUrl = import.meta.env.VITE_API_BASE_URL

	private onMessageCallback: ((message: TMessage) => void) | null = null
	private onFriendOnlineCallback: ((userId: number) => void) | null = null
	private onFriendOfflineCallback: ((userId: number) => void) | null = null

	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			const token = useAuthStore.getState().accessToken

			if (!token) {
				reject(new Error('Access token is not found'))
				return
			}

			this.disconnect()

			this.socket = io(`${this.baseUrl}/chat`, {
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
				console.log('new message', message)
				if (this.onMessageCallback) {
					this.onMessageCallback(message)
				}
			})
			this.socket.on('friendOnline', (data: { userId: number }) => {
				console.log(`🟢 friend ${data.userId} online`)
				if (this.onFriendOnlineCallback) {
					this.onFriendOnlineCallback(data.userId)
				}
			})

			this.socket.on('friendOffline', (data: { userId: number }) => {
				console.log(`🔴 friend ${data.userId} offline`)
				if (this.onFriendOfflineCallback) {
					this.onFriendOfflineCallback(data.userId)
				}
			})

			this.socket.on('chatHistory', (data: { messages: TMessage[] }) => {
				console.log('📜 История чата:', data.messages.length, 'сообщений')
			})

			this.socket.on('tokenExpired', () => {
				console.log('⚠️ Токен истек')
				this.refreshTokenAndReconnect()
			})
		})
	}
	sendMessageToFriend(receiverId: number, content: string): void {
		if (!this.socket?.connected) {
			console.error('Socket is not connected')
			return
		}
		console.log(`📩 Sending message to ${receiverId}:`, content)
		this.socket.emit('sendMessage', { receiverId, content })
	}
	getHistoryWhithFriend(friendId: number): void {
		if (!this.socket?.connected) return
		this.socket.emit('getHistory', { friendId })
	}
	onMessage(callback: (message: TMessage) => void): void {
		this.onMessageCallback = callback
	}
	onFriendOnline(callback: (userId: number) => void): void {
		this.onFriendOnlineCallback = callback
	}
	onFriendOffline(callback: (userId: number) => void): void {
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
	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect()
			this.socket = null
			this.onMessageCallback = null
			this.onFriendOnlineCallback = null
			this.onFriendOfflineCallback = null
		}
	}
  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const personalChatService = new PesonalChatService()
