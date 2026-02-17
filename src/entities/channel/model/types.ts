export type TTypeChannel = 'text' | 'voice'

export type TChannel = {
	id: number
	name: string
	type: TTypeChannel
	createdAt: string
}
