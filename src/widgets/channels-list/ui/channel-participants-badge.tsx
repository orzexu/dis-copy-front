import { useEffect, useRef } from 'react'
import { livekitApi } from '@shared/api/livekit-api'
import { useRoomsStore } from '@features/voice-chat/model'
import { UsersIcon } from '@heroicons/react/16/solid'

type Props = {
  channelId: number
}

export const ChannelParticipantsBadge = ({ channelId }: Props) => {
  const roomName = `channel_${channelId}`
  
  const participantsCount = useRoomsStore((state) => {
    const roomInfo = state.rooms.get(roomName)
    return roomInfo?.participants.length ?? 0
  })
  
  const setParticipants = useRoomsStore((state) => state.setParticipants)
  const setLoading = useRoomsStore((state) => state.setLoading)
  const isLoading = useRoomsStore((state) => state.rooms.get(roomName)?.isLoading ?? false)
  
  const hasFetched = useRef(false)

  useEffect(() => {
    if (participantsCount === 0 && !isLoading && !hasFetched.current) {
      hasFetched.current = true
      setLoading(roomName, true)
      livekitApi.getRoomParticipants(roomName)
        .then((participants) => {
          setParticipants(roomName, participants)
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(roomName, false))
    }
  }, [roomName, participantsCount, isLoading, setLoading, setParticipants])

  if (participantsCount === 0) return null

  return (
    <div className="flex items-center gap-1.5 ml-auto text-xs text-zinc-400">
      <UsersIcon className="w-4 h-4" />
      <span>{participantsCount}</span>
    </div>
  )
}