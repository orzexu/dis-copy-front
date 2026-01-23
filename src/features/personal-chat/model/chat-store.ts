import { TMessage } from '@entities/message/model';
import { create } from 'zustand';

type ChatStore = {
  //state
  messages: Record<number, TMessage[]>;
  onlineUsers: Set<number>;
  typingUsers: Record<number, boolean>;
  unreadCounts: Record<number, number>;

  //actions
  addMessage: (friendId: number, message: TMessage) => void;
  setMessages: (friendId: number, messages: TMessage[]) => void;
  setOnline: (userId: number, isOnline: boolean) => void;
  setOffline: (userId: number) => void;
  setTyping: (userId: number, isTyping: boolean) => void;
  resetUnread: (friendId: number) => void;
  markMessagesAsRead: (friendId: number) => void

  //getters
  getMessagesWithFriend: (friendId: number) => TMessage[];
  isUserTyping: (friendId: number) => boolean;
  getUnreadCount: (friendId: number) => number;

  //other
  clearStore: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  //state
  messages: {},
  onlineUsers: new Set(),
  typingUsers: {},
  unreadCounts: {},

  //actions
  addMessage: (friendId, message) => {
    set(state => {
      const currentMessages = state.messages[friendId] || [];
      const exists = currentMessages.some(m => m.id === message.id);

      if (exists) return state;

      // Увеличиваем unread только если сообщение от другого пользователя и не прочитано
      let newUnreadCounts = { ...state.unreadCounts };
      if (message.isRead === false) {
        const currentCount = state.unreadCounts[friendId] || 0;
        newUnreadCounts[friendId] = currentCount + 1;
      }

      return {
        messages: {
          ...state.messages,
          [friendId]: [...currentMessages, message].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        },
        unreadCounts: newUnreadCounts,
      };
    });
  },

  setMessages: (friendId, messages) => {
    set(state => ({
      messages: {
        ...state.messages,
        [friendId]: messages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      },
    }));
  },

  setOnline: (userId, isOnline) => {
    set(state => {
      const newOnline = new Set(state.onlineUsers);
      if (isOnline) {
        newOnline.add(userId);
      } else {
        newOnline.delete(userId);
      }
      return { onlineUsers: newOnline };
    });
  },

  setOffline: (userId) => {
    set(state => {
      const newOnline = new Set(state.onlineUsers);
      newOnline.delete(userId);
      return { onlineUsers: newOnline };
    });
  },

  setTyping: (userId, isTyping) => {
    set(state => {
      const newTyping = { ...state.typingUsers };
      if (isTyping) {
        newTyping[userId] = true;
      } else {
        delete newTyping[userId];
      }
      return { typingUsers: newTyping };
    });
  },

  resetUnread: (friendId) => {
    set(state => ({
      unreadCounts: {
        ...state.unreadCounts,
        [friendId]: 0,
      },
    }));
  },

  markMessagesAsRead: (friendId) => {
  set(state => {
    const messages = state.messages[friendId] || [];
    const updatedMessages = messages.map(msg => ({
      ...msg,
      isRead: true,
    }));
    
    return {
      messages: {
        ...state.messages,
        [friendId]: updatedMessages,
      },
    };
  });
},

  //getters
  getMessagesWithFriend: (friendId) => {
    return get().messages[friendId] || [];
  },

  isUserTyping: (friendId) => {
    return get().typingUsers[friendId] || false;
  },

  getUnreadCount: (friendId) => {
    return get().unreadCounts[friendId] || 0;
  },

  //other
  clearStore: () => {
    set({
      messages: {},
      onlineUsers: new Set(),
      typingUsers: {},
      unreadCounts: {},
    });
  },
}));