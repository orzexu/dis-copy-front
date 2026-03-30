import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TDevicesSettings = {
	//audio
	microphoneId: string | null
	speakerId: string | null
	inputVolume: number
	outputVolume: number

	//video
	cameraId: string | null
	videoEnabled: boolean
}

type DevicesSettingsStore = TDevicesSettings & {
	setMicrophone: (id: string | null) => void
	setSpeaker: (id: string | null) => void
	setInputVolume: (vol: number) => void
	setOutputVolume: (vol: number) => void
	setCamera: (id: string | null) => void
	toggleVideo: () => void
	resetSettings: () => void
}

const INITIAL_SETTINGS: TDevicesSettings = {
	microphoneId: null,
	speakerId: null,
	inputVolume: 1,
	outputVolume: 1,
	cameraId: null,
	videoEnabled: true,
}

export const useDevicesSettingsStore = create<DevicesSettingsStore>()(
	persist(
		set => ({
			...INITIAL_SETTINGS,

			setMicrophone: id => set({ microphoneId: id }),
			setSpeaker: id => set({ speakerId: id }),
			setInputVolume: vol =>
				set({ inputVolume: Math.max(0, Math.min(1, vol)) }),
			setOutputVolume: vol =>
				set({ outputVolume: Math.max(0, Math.min(1, vol)) }),

			setCamera: id => set({ cameraId: id }),
			toggleVideo: () => set(state => ({ videoEnabled: !state.videoEnabled })),

			resetSettings: () => set(INITIAL_SETTINGS),
		}),
		{
			name: 'devices-settings-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: state => ({
				microphoneId: state.microphoneId,
				speakerId: state.speakerId,
				inputVolume: state.inputVolume,
				outputVolume: state.outputVolume,
				cameraId: state.cameraId,
				videoEnabled: state.videoEnabled,
			}),
		},
	),
)
