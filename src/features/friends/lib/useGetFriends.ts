import { useFriendsStore } from "@entities/friend/model"
import { getFriends, QUERY_KEYS } from "@shared/api"
import { useQuery } from "@tanstack/react-query"

export const useGetFriends = () => {
  const { setFriends } = useFriendsStore()
  return useQuery({
    queryKey: QUERY_KEYS.friends,
    queryFn: async () => {
      const response = await getFriends()
      setFriends(response)
      return response
    },
  })
}