import { TChannel } from '@entities/channel/model'
import { TUser } from '@entities/user/model'

export type TServer = {
	id: number
	name: string
	iconUrl: string
	owner: TUser
	channels: TChannel[]
	createdAt: string
	updatedAt: string
}
