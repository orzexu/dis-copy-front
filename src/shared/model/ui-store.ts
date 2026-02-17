import { create } from 'zustand'

type MiddlePanel = 'friends' | 'channels'
type MainPanel =
	| null
	| 'pesonalChat'
	| 'channelTextChat'
	| 'friendRequests'
	| 'channelVoiceChat'

type UiStore = {
	selectedUserId: number | null
	selectedServerId: number | null
	selectedChannelId: number | null

	middlePanel: MiddlePanel
	mainPanel: MainPanel

	setSelectedUserId: (value: number | null) => void
	setSelectedServerId: (value: number | null) => void

	setMiddlePanel: (value: MiddlePanel) => void
	setMainPanel: (value: MainPanel) => void

	setSelectedChannelId: (value: number | null) => void

	modals: Record<string, boolean>
	openModal: (id: string) => void
	closeModal: (id: string) => void
	toggleModal: (id: string) => void
}

export const useUiStore = create<UiStore>(set => ({
	selectedUserId: null,
	selectedServerId: null,
	selectedChannelId: null,
	middlePanel: 'friends',
	mainPanel: null,
	modals: {},

	setSelectedUserId: value => set({ selectedUserId: value }),
	setSelectedServerId: value => set({ selectedServerId: value }),
	setSelectedChannelId: value => set({ selectedChannelId: value }),

	setMiddlePanel: value => set({ middlePanel: value }),
	setMainPanel: value => set({ mainPanel: value }),

	openModal: id =>
		set(state => ({
			modals: { ...state.modals, [id]: true },
		})),

	closeModal: id =>
		set(state => ({
			modals: { ...state.modals, [id]: false },
		})),

	toggleModal: id =>
		set(state => ({
			modals: {
				...state.modals,
				[id]: !state.modals[id],
			},
		})),
}))
