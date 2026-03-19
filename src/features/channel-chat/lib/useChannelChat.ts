import { useAuthStore } from '@entities/user/model';
import { serverChatService } from '@shared/api/server-chat-socket';
import { useChannelChatStore } from '../model';
import { useCallback, useEffect, useState } from 'react';
import { TChannelMessage } from '@entities/channel-message/model';

type UseChannelChatProps = {
  channelId: number;
};

export const useChannelChat = ({ channelId }: UseChannelChatProps) => {
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id;

  const { getChannelMessages, setChannelMessages } = useChannelChatStore();

  const chatMessages = getChannelMessages(channelId);

  //  Авто-скролл вниз при новых сообщениях (опционально, можно вынести в компонент)
  useEffect(() => {
    const container = document.querySelector('.channel-chat-messages');
    if (container && historyLoaded) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages, historyLoaded]);

  //  Подключение и загрузка истории
  useEffect(() => {
    const loadHistory = async () => {
      // Если сокет не подключен глобально (в useGlobalSocket), подключаем здесь.
      // Но обычно он уже подключен глобально, поэтому isConnected станет true быстро.
      if (!serverChatService.isConnected()) {
        try {
          await serverChatService.connect();
          setIsConnected(true);
        } catch (error) {
          console.error('Failed to connect for channel history:', error);
          return;
        }
      } else {
        setIsConnected(true);
      }

      // Запрашиваем историю для ЭТОГО канала
      serverChatService.getChannelHistory(channelId, 50);

      // Обработчик получения истории
      const handleChannelHistory = (messages: TChannelMessage[]) => {
        setChannelMessages(channelId, messages);
        setHistoryLoaded(true);
      };

      // Подписываемся на событие истории конкретного канала
      serverChatService.onChannelMessages(channelId, handleChannelHistory);

      return () => {
        // Отписываемся при размонтировании или смене канала
        serverChatService.offChannelMessages(channelId, handleChannelHistory);
      };
    };

    loadHistory();
  }, [channelId]);

  // 🔥 Отправка сообщения
  const sendMessage = useCallback(() => {
    if (!input.trim() || !isConnected || !channelId) return;

    serverChatService.sendChannelMessage(channelId, input);
    setInput('');
  }, [input, isConnected, channelId]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const handleInputChange = (value: string) => {
    setInput(value);
    // Здесь можно добавить логику Typing Status, если она нужна в каналах
    // serverChatService.sendTypingStatus(channelId, value.length > 0);
  };

  return {
    // State
    messages: chatMessages,
    isConnected,
    historyLoaded,
    input,

    // Actions
    setInput: handleInputChange,
    sendMessage,
    handleKeyPress,

    // Utils
    isOwnMessage: (message: TChannelMessage) => message.sender.id === currentUserId,
  };
};