export type TMessage = {
  id: number,
  content: string,
  senderId: number,
  receiverId: number,
  createdAt: string,
  isRead: boolean
}

export type TSendMessageDto = {
  content: string,
  receiverId: number
}

export type TChatUser = {
  id: number,
  username: string,
  avatar?: string,
  isOnline: boolean
}