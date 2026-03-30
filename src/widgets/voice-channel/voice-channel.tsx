import { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useTracks,
  ConnectionState,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { useAuthStore } from '@entities/user/model';
import { LoadingSpinner } from '@shared/ui';
import { useDevicesSettingsStore } from '@features/divices-settings/model';
import { apiClient } from '@shared/api';

type Props = {
  roomName: string;
};

export const VoiceChannel = ({ roomName }: Props) => {
  const [token, setToken] = useState('');
  const [wsUrl, setWsUrl] = useState('');
  
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { microphoneId, speakerId, outputVolume } = useDevicesSettingsStore();

  useEffect(() => {
    if (!user || !accessToken) return;
    const fetchToken = async () => {
      try {
        const response = await apiClient.get('/livekit/token', {
          params: { room: roomName },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setToken(response.data.token);
        setWsUrl(response.data.wsUrl);
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };
    fetchToken();
  }, [user, accessToken, roomName]);

  if (!token || !wsUrl) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        <LoadingSpinner className="w-8 h-8" />
        <span className="ml-2">Подключение...</span>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={true}
      video={false}
      audio={{
        deviceId: microphoneId || undefined,
      }}
      options={{ adaptiveStream: true, dynacast: true }}
      className="flex flex-col h-full bg-zinc-900"
    >
      <div className="h-14 border-b border-zinc-800 bg-zinc-800/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-white font-bold">Голосовой канал</h3>
        </div>
        {/* Готовая панель управления от LiveKit */}
        <VideoConference />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ParticipantList />
      </div>

      <RoomAudioRenderer />
      
      {/* Регулировка громкости */}
      <GlobalVolumeControl volume={outputVolume} />
    </LiveKitRoom>
  );
};

function ParticipantList() {
  const tracks = useTracks([Track.Source.Microphone], { onlySubscribed: false });
  
  if (tracks.length === 0) {
    return <div className="text-zinc-500 text-center mt-10">В канале никого нет</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tracks.map((trackRef) => {
        const p = trackRef.participant;
        return (
          <div key={p.sid} className="bg-zinc-800 p-3 rounded-xl border border-zinc-700 flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${p.isSpeaking ? 'bg-green-500' : 'bg-zinc-600'}`} />
             <span className="text-white font-medium">{p.name || p.identity}</span>
             {p.isLocal && <span className="text-xs text-zinc-400">(Вы)</span>}
          </div>
        );
      })}
    </div>
  );
}

function GlobalVolumeControl({ volume }: { volume: number }) {
  useEffect(() => {
    const els = document.querySelectorAll('audio[data-lk-audio]');
    els.forEach((el) => ((el as HTMLAudioElement).volume = volume));
  }, [volume]);
  return null;
}