import { useFriendsStore } from "@entities/friend/model"
import { getFriendRequests, QUERY_KEYS } from "@shared/api"
import { useQuery } from "@tanstack/react-query"

export const useGetFriendRequests = () => {
  const setIncomingRequests = useFriendsStore(store => store.setIncomingRequests)
  return useQuery({
    queryKey: QUERY_KEYS.friendRequests,
    queryFn: async () => {
      const requests = await getFriendRequests()
      setIncomingRequests(requests)
      return requests
    },
  })
}