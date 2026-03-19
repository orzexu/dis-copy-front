import { TChannel } from "@entities/channel/model"
import { TUser } from "@entities/user/model"

export type TChannelMessage = {
  id: number
  content: string
  sender: TUser
  channel: TChannel
  createdAt: string
}