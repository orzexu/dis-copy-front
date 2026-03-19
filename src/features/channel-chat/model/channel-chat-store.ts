import { TChannelMessage } from '@entities/channel-message/model'
import { create } from 'zustand'

type ChannelChatStore = {
	messages: Record<number, TChannelMessage[]>
	addMessage: (message: TChannelMessage) => void
	setChannelMessages: (channelId: number, messages: TChannelMessage[]) => void
	clearChannelMessages: (channelId: number) => void
	getChannelMessages: (channelId: number) => TChannelMessage[]
}

export const useChannelChatStore = create<ChannelChatStore>((set, get) => ({
	messages: {},

	addMessage: message =>
		set(state => ({
			messages: {
				...state.messages,
				[message.channel.id]: [
					...(state.messages[message.channel.id] || []),
					message,
				],
			},
		})),

	setChannelMessages: (channelId, messages) =>
		set(state => ({
			messages: {
				...state.messages,
				[channelId]: messages,
			},
		})),

	clearChannelMessages: channelId =>
		set(state => ({
			messages: {
				...state.messages,
				[channelId]: [],
			},
		})),

	getChannelMessages: channelId => {
		return get().messages[channelId] || []
	},
}))
