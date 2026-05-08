import { useAuthStore } from '@entities/user/model'
import { useDevicesSettingsStore } from '@features/divices-settings/model'
import { LiveKitRoom, RoomAudioRenderer, useRemoteParticipants, useLocalParticipant } from '@livekit/components-react'
import { apiClient } from '@shared/api'
import { useEffect, useState } from 'react'
import { useRoomsStore } from '@features/voice-chat/model'
import { VoiceChatControls } from '@widgets/channel-voice-chat/components/voice-chat-controls'
import { ParticipantsList } from '@widgets/channel-voice-chat/components/participants-list'

type Props = {
  roomName: string
  onLeave: () => void
}

export const ChannelVoiceChat = ({ roomName, onLeave }: Props) => {
  const user = useAuthStore(s => s.user)
  const accessToken = useAuthStore(s => s.accessToken)
  const { microphoneId } = useDevicesSettingsStore()
  const [token, setToken] = useState('')
  const [wsUrl, setWsUrl] = useState('')

  useEffect(() => {
    if (!user || !accessToken) return
    const fetchToken = async () => {
      try {
        const res = await apiClient.get('/livekit/token', {
          params: { room: roomName },
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setToken(res.data.token)
        setWsUrl(res.data.wsUrl)
      } catch (e) {
        console.error('Failed to get voice token', e)
      }
    }
    fetchToken()
  }, [roomName, user, accessToken])

  if (!token) {
    return <div className="text-zinc-500">Подключение к голосовому каналу...</div>
  }

  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={true}
      video={false}
      audio={{ deviceId: microphoneId || undefined }}
      options={{ adaptiveStream: true, dynacast: true }}
      className="flex flex-col h-full"
    >
      <RoomParticipantsObserver roomName={roomName} />
      <RoomAudioRenderer />
      {/* ------------------- */}
      <div className="flex-1 p-4">
        <ParticipantsList />
      </div>
      <div className='mt-auto p-4 flex justify-center'>
        <VoiceChatControls onLeave={onLeave} />
      </div>
    </LiveKitRoom>
  )
}

const RoomParticipantsObserver = ({ roomName }: { roomName: string }) => {
  const remoteParticipants = useRemoteParticipants()
  const { localParticipant } = useLocalParticipant()
  const setParticipants = useRoomsStore(s => s.setParticipants)

  useEffect(() => {
    const all = [
      ...remoteParticipants.map(p => ({ identity: p.identity, name: p.name || p.identity })),
      localParticipant ? { identity: localParticipant.identity, name: localParticipant.name || 'You' } : null,
    ].filter(Boolean) as { identity: string; name: string }[]

    setParticipants(roomName, all)
  }, [remoteParticipants, localParticipant, roomName, setParticipants])

  return null
}
