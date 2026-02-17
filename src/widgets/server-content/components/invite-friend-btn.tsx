import { UserPlusIcon } from '@heroicons/react/16/solid'

type Props = {
	onClick: () => void
}

export const InviteFriendBtn = ({ onClick }: Props) => {
	return (
		<button
			className="flex gap-2 items-center p-2 rounded hover:bg-zinc-700 transition-colors"
			onClick={onClick}
		>
			<UserPlusIcon className="w-6 h-6" />
			<p>Invite friend to server</p>
		</button>
	)
}
