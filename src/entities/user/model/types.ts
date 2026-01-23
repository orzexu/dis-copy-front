export type UserResponseDto = {
  id: number
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

export type SearchUsersDto = {
  id: number
  username: string
  createdAt: string
  friendshipStatus: 'friend' | 'requested' | 'incoming' | 'none'
}