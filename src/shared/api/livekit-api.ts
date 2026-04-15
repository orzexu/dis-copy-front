import { apiClient } from '@shared/api/axios-instance'

export type LiveKitParticipant = {
	identity: string
	name: string
}

export const livekitApi = {
	getToken: async (room: string) => {
		const response = await apiClient.get('/livekit/token', {
			params: { room },
		})
		return response.data as { token: string; wsUrl: string }
	},

	getRoomParticipants: async (room: string): Promise<LiveKitParticipant[]> => {
		const response = await apiClient.get('livekit/participants', {
			params: { room },
		})
    return response.data.participants
	},
}
