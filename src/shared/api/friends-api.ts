import { TFriend } from "@entities/friend/model";
import { apiClient } from "@shared/api/axios-instance"

export const getFriends = async (): Promise<TFriend[]> => {
  const response = await apiClient.get<{data: TFriend[]}>('/friends');
  return response.data.data;
}

export const getFriendRequests = async (): Promise<TFriend[]> => {
  const response = await apiClient.get<{data: TFriend[]}>('/friends/requests')
  return response.data.data
}

export const sendFriendRequest = async (targetId: number): Promise<void> => {
  await apiClient.post('/friends/request', { targetId })
}

export const acceptFriendRequest = async (requesterId: number): Promise<void> => {
  await apiClient.post('/friends/accept', { requesterId })
}

export const removeFriend = async (friendId: number): Promise<void> => {
  await apiClient.post('/friends/remove', { friendId })
}

export const declineFriendRequest = async (requesterId: number): Promise<void> => {
  await apiClient.post('/friends/decline', { requesterId })
}