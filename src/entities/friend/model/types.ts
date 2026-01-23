export type TFriend = {
  id: number
  username: string
  createdAt?: string
  friendshipStatus?: 'friend' | 'requested' | 'incoming' | 'none'
}