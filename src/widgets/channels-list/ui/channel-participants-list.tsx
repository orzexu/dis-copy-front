import { useEffect, useRef } from 'react'
import { livekitApi } from '@shared/api/livekit-api'
import { useRoomsStore } from '@features/voice-chat/model'
import { Avatar } from '@shared/ui'
import { useUsersStore } from '@entities/user/model'

type Props = {
  channelId: number
}

export const ChannelParticipantsList = ({ channelId }: Props) => {
  const roomName = `channel_${channelId}`

  const roomInfo = useRoomsStore((state) => state.rooms.get(roomName))
  const participants = roomInfo?.participants ?? []
  const isLoading = roomInfo?.isLoading ?? false

  const setParticipants = useRoomsStore((state) => state.setParticipants)
  const setLoading = useRoomsStore((state) => state.setLoading)

  const hasFetched = useRef(false)

  const { getUserByName } = useUsersStore()

  useEffect(() => {
    if (participants.length === 0 && !isLoading && !hasFetched.current) {
      hasFetched.current = true
      setLoading(roomName, true)
      livekitApi.getRoomParticipants(roomName)
        .then((fetchedParticipants) => {
          setParticipants(roomName, fetchedParticipants)
        })
        .catch((err) => console.error(`Failed to load participants for ${roomName}:`, err))
        .finally(() => setLoading(roomName, false))
    }
  }, [roomName, participants.length, isLoading, setLoading, setParticipants])

  if (isLoading && participants.length === 0) {
    return (
      <div className="ml-8 mt-0.5 p-1">
        <div className="text-xs text-zinc-500">Загрузка...</div>
      </div>
    )
  }

  if (participants.length === 0) {
    return null
  }

  return (
    <div className="ml-8 mt-0.5 p-1 w-full z-10">
      <ul className="space-y-1">
        {participants.map((p) => {
          const user = getUserByName(p.name)
          return (
            <li
              key={p.identity}
              className="text-sm text-white flex items-center gap-1"
            >
              <Avatar size="sm" fallback={p.name} src={user?.avatarUrl} />
              <span className='text-md'>{p.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}