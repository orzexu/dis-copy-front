import { useCallback } from 'react'
import { livekitApi } from '@shared/api/livekit-api'
import { useRoomsStore } from '../model/use-rooms-store'

export const useRoomParticipants = () => {
  const setParticipants = useRoomsStore((state) => state.setParticipants)
  const setLoading = useRoomsStore((state) => state.setLoading)
  const getParticipants = useRoomsStore((state) => state.getParticipants)

  const fetchParticipants = useCallback(
    async (roomName: string) => {
      const existing = getParticipants(roomName)
      if (existing.length > 0) {
        return existing
      }

      setLoading(roomName, true)

      try {
        const participants = await livekitApi.getRoomParticipants(roomName)
        setParticipants(roomName, participants)
        return participants
      } catch (error) {
        console.error(`Failed to fetch participants for ${roomName}:`, error)
        return []
      } finally {
        setLoading(roomName, false)
      }
    },
    [setParticipants, setLoading, getParticipants]
  )

  return {
    fetchParticipants,
    getParticipants,
  }
}