export type UserResponseDto = {
  id: number
  email: string
  username: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export type SearchUsersDto = {
  id: number
  username: string
  avatarUrl?: string
  createdAt: string
  friendshipStatus: 'friend' | 'requested' | 'incoming' | 'none'
}