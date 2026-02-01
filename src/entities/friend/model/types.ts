export type TFriend = {
  id: number
  username: string
  avatarUrl: string
  createdAt?: string
  friendshipStatus?: 'friend' | 'requested' | 'incoming' | 'none'
}