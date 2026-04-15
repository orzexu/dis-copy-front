import { create } from 'zustand'
import { LiveKitParticipant } from '@shared/api/livekit-api'

type RoomInfo = {
  participants: LiveKitParticipant[]
  isLoading: boolean
  lastFetched: number | null
}

type RoomsStore = {
  rooms: Map<string, RoomInfo>
  currentRoom: string | null
  
  setParticipants: (roomName: string, participants: LiveKitParticipant[]) => void
  setLoading: (roomName: string, isLoading: boolean) => void
  setCurrentRoom: (roomName: string | null) => void
  
  getParticipants: (roomName: string) => LiveKitParticipant[]
  getParticipantsCount: (roomName: string) => number
}

export const useRoomsStore = create<RoomsStore>((set, get) => ({
  rooms: new Map(),
  currentRoom: null,
  
  setParticipants: (roomName, participants) => {
    set((state) => {
      const newRooms = new Map(state.rooms)
      newRooms.set(roomName, {
        participants,
        isLoading: false,
        lastFetched: Date.now(),
      })
      return { rooms: newRooms }
    })
  },
  
  setLoading: (roomName, isLoading) => {
    set((state) => {
      const newRooms = new Map(state.rooms)
      const existing = newRooms.get(roomName)
      newRooms.set(roomName, {
        participants: existing?.participants || [],
        isLoading,
        lastFetched: existing?.lastFetched || null,
      })
      return { rooms: newRooms }
    })
  },
  
  setCurrentRoom: (roomName) => set({ currentRoom: roomName }),
  
  getParticipants: (roomName) => {
    return get().rooms.get(roomName)?.participants || []
  },
  
  getParticipantsCount: (roomName) => {
    return get().rooms.get(roomName)?.participants.length || 0
  },
}))