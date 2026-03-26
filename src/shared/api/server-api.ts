import { TServer } from '@entities/server/model'
import { TUser } from '@entities/user/model'
import { CreateServerData } from '@features/servers-bar/schemas'
import { apiClient } from '@shared/api/axios-instance'

export const getUserServers = async (): Promise<TServer[]> => {
	const response = await apiClient.get<{ data: TServer[] }>(
		'/servers/user-servers',
	)
	return response.data.data
}

export const createServer = async (
	data: CreateServerData,
): Promise<TServer> => {
	const response = await apiClient.post<{ data: TServer }>('/servers', data)
	return response.data.data
}

export const generateServerInvite = async (
	serverId: number,
): Promise<{ code: string }> => {
	const response = await apiClient.post<{ data: { code: string } }>(
		`/servers/${serverId}/invite`,
	)

	return response.data.data
}

export const joinServerByInvite = async (inviteCode: string): Promise<void> => {
	await apiClient.post('/servers/join', { inviteCode })
}

export const getServerMembers = async (serverId: number): Promise<TUser[]> => {
	const response = await apiClient.get<{ data: TUser[] }>(
		`/servers/${serverId}/members`,
	)
	return response.data.data
}
