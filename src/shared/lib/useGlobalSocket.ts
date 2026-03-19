import { useEffect } from 'react'
import { personalChatService } from '@shared/api/personal-chat-socket'
import { serverChatService } from '@shared/api/server-chat-socket'
import { useAuthStore } from '@entities/user/model'
import { useChatStore } from '@features/personal-chat/model'
import { useChannelChatStore } from '@features/channel-chat/model'

export const useGlobalSocket = () => {
  const accessToken = useAuthStore(state => state.accessToken)
  const currentUser = useAuthStore(state => state.user)
  const currentUserId = currentUser?.id

  const {
    addMessage: addPersonalMessage,
    setOnline,
    setOffline,
    setTyping,
    resetUnread,
    markMessagesAsRead,
  } = useChatStore()

  const { addMessage: addChannelMessage } = useChannelChatStore()

  useEffect(() => {
    if (!accessToken || !currentUserId) return

    // --- Personal Chat ---
    personalChatService.connect().catch(() => {})

    personalChatService.onMessage(message => {
      const uid = useAuthStore.getState().user?.id
      const friendId = message.senderId === uid ? message.receiverId : message.senderId
      addPersonalMessage(friendId, message)
    })

    personalChatService.onUserOnline(userId => setOnline(userId, true))
    personalChatService.onUserOffline(userId => setOffline(userId))
    
    personalChatService.onTypingStatus(data => {
      if (data.senderId !== currentUserId) {
        setTyping(data.senderId, data.isTyping)
      }
    })

    personalChatService.onMessagesMarkedAsRead(data => {
      resetUnread(data.friendId)
      markMessagesAsRead(data.friendId)
    })

    // --- Server Chat ---
    serverChatService.connect().catch(() => {})

    // Новое сообщение пришло в любой канал, где мы состоим
    serverChatService.onNewChannelMessage(message => {
      addChannelMessage(message)
    })

    // Опционально: можно обновлять список серверов/каналов при событии serverJoined, 
    // если нужно динамически добавлять новые сервера без перезагрузки страницы.
    // Если список серверов грузится через HTTP API при старте, этот колбэк может быть пустым.
    serverChatService.onServerJoined(() => {
       // Логика при подключении к серверу (если нужна)
    })

    serverChatService.onReady(() => {
      // Все сервера загружены. Можно снять лоадер с чатов, если он есть.
    })

    serverChatService.onError((error) => {
      // Обработка критических ошибок сокета (опционально: показать тост)
      console.error('Socket error:', error.message) 
    })

    return () => {
      personalChatService.disconnect()
      serverChatService.disconnect()
    }
  }, [accessToken, currentUserId])
}