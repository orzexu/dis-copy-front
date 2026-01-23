import { TFriend } from '@entities/friend/model/types'
import { create } from 'zustand'

type FriendsStore = {
  friends: TFriend[]
	incomingRequests: TFriend[]
  selectedFriendId: number | null
  setFriends: (friends: TFriend[]) => void
	setIncomingRequests: (requests: TFriend[]) => void
  setSelectedFriendId: (id: number | null) => void
}

export const useFriendsStore = create<FriendsStore>(set => ({
	incomingRequests: [],
  friends: [],
  selectedFriendId: null,
  setFriends: friends => set({ friends }),
	setIncomingRequests: requests => set({ incomingRequests: requests }),
  setSelectedFriendId: id => set({ selectedFriendId: id }),
}))
