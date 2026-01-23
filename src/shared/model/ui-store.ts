import { create } from 'zustand'

type MiddlePanel = 'friends' | 'channels'
type MainPanel = null | 'pesonalChat' | 'channelChat' | 'friendRequests'

type UiStore = {
	selectedUserId: number | null

	middlePanel: MiddlePanel
	mainPanel: MainPanel

	setSelectedUserId: (value: number | null) => void

	setMiddlePanel: (value: MiddlePanel) => void
	setMainPanel: (value: MainPanel) => void
}

export const useUiStore = create<UiStore>(set => ({
	selectedUserId: null,
	middlePanel: 'friends',
	mainPanel: null,
	setSelectedUserId: value => set({ selectedUserId: value }),
	setMiddlePanel: value => set({ middlePanel: value }),
	setMainPanel: value => set({ mainPanel: value }),
}))
