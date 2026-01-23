import { SearchUsersDto } from '@entities/user/model'
import { UserPlusIcon } from '@heroicons/react/16/solid'
import { formatMessageTime } from '@shared/lib'

type Props = {
	user: SearchUsersDto
	friendshipStatus: 'friend' | 'requested' | 'incoming' | 'none'
	onClick: (id: number) => void
}

export const SearchUsersCard = ({ user, friendshipStatus, onClick }: Props) => {
	return (
		<div className="flex justify-between items-center px-2 py-4 rounded-md hover:bg-zinc-900">
			<div className="flex flex-col">
				<p className="text-zinc-300">{user.username}</p>
				<p className="text-[10px] text-zinc-400">
					Account created: {formatMessageTime(user.createdAt)}
				</p>
			</div>
			{friendshipStatus === 'friend' ? (
				<div className="text-green-400 text-sm">Friends</div>
			) : friendshipStatus === 'requested' ? (
				<div className="text-yellow-400 text-sm">Requested</div>
			) : friendshipStatus === 'incoming' ? (
				<div className="text-blue-400 text-sm text-wrap">Incoming request</div>
			) : (
				<button
					onClick={() => onClick(user.id)}
					className="hover:scale-115 duration-200"
				>
					<UserPlusIcon className="w-7 h-7 text-zinc-300" />
				</button>
			)}
		</div>
	)
}
