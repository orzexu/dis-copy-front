import { useSendFriendRequest } from '@features/friends/lib'
import { useSearchUsers } from '@features/search-user'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { cn, useDebounce } from '@shared/lib'
import { LoadingSpinner } from '@shared/ui'
import { SearchUsersCard } from '@widgets/search-users-bar/ui/search-users-card'
import { useCallback, useState } from 'react'

export const SearchUsersBar = () => {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const debouncedSearchQuery = useDebounce(searchQuery, 350)
	const { data: searchUsers, isLoading } = useSearchUsers(debouncedSearchQuery)
	const { mutate: sendFriendRequest } = useSendFriendRequest()
	const isDisabled = searchQuery.trim().length === 0

  const handleSendRequest = useCallback((userId: number) => {
    sendFriendRequest(userId)
  }, [sendFriendRequest])

	return (
		<>
			<div className="flex justify-between relative">
				<input
					type="text"
					className="min-h-8 w-full px-2 rounded-md border border-zinc-700 focus:border-zinc-500 placeholder:text-sm placeholder:text-zinc-600"
					placeholder="Search users"
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				{!isLoading && (
					<button
						className={cn(
							'absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-400',
							isDisabled && 'opacity-30'
						)}
						onClick={() => setSearchQuery('')}
						disabled={isDisabled}
					>
						<XMarkIcon className="w-6 h-6" />
					</button>
				)}
				{isLoading && <LoadingSpinner className="w-5 h-5 absolute right-2" />}
			</div>
			{!isLoading && searchUsers?.length === 0 && (
				<div className="absolute top-10 left-0.5 w-full h-max flex justify-center items-center bg-zinc-800 shadow-app-primary rounded-md p-2">
					No users found
				</div>
			)}
			{!isLoading && searchUsers !== undefined && searchUsers?.length > 0 && (
				<div className="absolute top-10 left-0.5 w-full max-h-11/12 h-max flex flex-col bg-zinc-800 shadow-app-primary rounded-md p-2 overflow-y-auto">
					{searchUsers?.map(user => (
							<SearchUsersCard
								key={user.id}
								user={user}
								friendshipStatus={user.friendshipStatus}
								onClick={handleSendRequest}
							/>
						)
					)}
				</div>
			)}
		</>
	)
}
