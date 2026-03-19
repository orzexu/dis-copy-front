import { TChannelMessage } from '@entities/channel-message/model';
import { useAuthStore } from '@entities/user/model';
import { refreshAccessToken } from '@shared/api/auth-api';
import { io, Socket } from 'socket.io-client';

class ServerChatService {
  private socket: Socket | null = null;
  private baseUrl = import.meta.env.VITE_SOCKET_SERVER_CHAT_URL;

  // Callbacks
  private onNewChannelMessageCallback: ((message: TChannelMessage) => void) | null = null;
  private onServerJoinedCallback: ((data: { serverId: number; channelIds: number[] }) => void) | null = null;
  private onReadyCallback: (() => void) | null = null;
  private onErrorCallback: ((error: { message: string }) => void) | null = null;
  
  // Динамические подписки на историю каналов
  private onChannelHistoryCallbacks: Record<string, (messages: TChannelMessage[]) => void> = {};

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = useAuthStore.getState().accessToken;

      if (!token) {
        reject(new Error('Access token not found'));
        return;
      }

      this.disconnect();

      this.socket = io(`${this.baseUrl}`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('connected in channel chat')
        resolve()
      });
      
      this.socket.on('connect_error', (error) => reject(error));

      // --- События ---

      this.socket.on('newChannelMessage', (message: TChannelMessage) => {
        if (this.onNewChannelMessageCallback) {
          this.onNewChannelMessageCallback(message);
        }
      });

      this.socket.on('serverJoined', (data: { serverId: number; channelIds: number[] }) => {
        if (this.onServerJoinedCallback) {
          this.onServerJoinedCallback(data);
        }
      });

      this.socket.on('ready', () => {
        if (this.onReadyCallback) {
          this.onReadyCallback();
        }
      });

      this.socket.on('error', (error: { message: string }) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
      });

      this.socket.on('tokenExpired', () => {
        this.refreshTokenAndReconnect();
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.onNewChannelMessageCallback = null;
      this.onServerJoinedCallback = null;
      this.onReadyCallback = null;
      this.onErrorCallback = null;
      this.onChannelHistoryCallbacks = {};
    }
  }

  sendChannelMessage(channelId: number, content: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit('sendChannelMessage', { channelId, content });
  }

  getChannelHistory(channelId: number, limit: number = 50): void {
    if (!this.socket?.connected) return;
    this.socket.emit('getChannelHistory', { channelId, limit });
  }

  // --- Подписчики ---

  onNewChannelMessage(callback: (message: TChannelMessage) => void): void {
    this.onNewChannelMessageCallback = callback;
  }

  onServerJoined(callback: (data: { serverId: number; channelIds: number[] }) => void): void {
    this.onServerJoinedCallback = callback;
  }

  onReady(callback: () => void): void {
    this.onReadyCallback = callback;
  }

  onError(callback: (error: { message: string }) => void): void {
    this.onErrorCallback = callback;
  }

  onChannelMessages(channelId: number, callback: (messages: TChannelMessage[]) => void): void {
    const eventKey = `channelMessages_${channelId}`;

    if (this.onChannelHistoryCallbacks[eventKey]) {
      this.socket?.off(eventKey, this.onChannelHistoryCallbacks[eventKey]);
    }

    this.onChannelHistoryCallbacks[eventKey] = callback;
    this.socket?.on(eventKey, callback);
  }

  offChannelMessages(channelId: number, callback: (messages: TChannelMessage[]) => void): void {
    const eventKey = `channelMessages_${channelId}`;
    this.socket?.off(eventKey, callback);
    delete this.onChannelHistoryCallbacks[eventKey];
  }

  // --- Логика ---

  private async refreshTokenAndReconnect(): Promise<void> {
    try {
      const response = await refreshAccessToken();
      if (response.status === 200) {
        const data = await response.data.data;
        useAuthStore.getState().setAccessToken(data.accessToken);
        await this.connect();
      } else {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    } catch (error) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  clearSubscriptions(): void {
    if (!this.socket) return;

    Object.keys(this.onChannelHistoryCallbacks).forEach((eventKey) => {
      this.socket?.off(eventKey, this.onChannelHistoryCallbacks[eventKey]);
    });

    if (this.onNewChannelMessageCallback) this.socket.off('newChannelMessage', this.onNewChannelMessageCallback);
    if (this.onServerJoinedCallback) this.socket.off('serverJoined', this.onServerJoinedCallback);
    if (this.onReadyCallback) this.socket.off('ready', this.onReadyCallback);
    if (this.onErrorCallback) this.socket.off('error', this.onErrorCallback);
  }
}

export const serverChatService = new ServerChatService();