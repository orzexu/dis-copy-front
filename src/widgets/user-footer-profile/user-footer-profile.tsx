import { useGetProfile } from '@features/user'
import { Cog8ToothIcon } from '@heroicons/react/16/solid'
import { Avatar, LoadingSpinner } from '@shared/ui'

export const UserFooterProfile = () => {
	const { data: profile, isLoading } = useGetProfile()

	return (
		<div className="min-h-12 border rounded-md border-zinc-700">
			{isLoading && (
				<div className="flex h-full items-center justify-center">
					<LoadingSpinner className="w-8 h-8" />
				</div>
			)}
			{!isLoading && profile && (
				<div className="flex h-full justify-between items-center p-1">
					<div className="flex items-center gap-2">
						<Avatar fallback={profile.username} isOnline={!isLoading} />
						<p className="text-md text-zinc-300">{profile.username}</p>
					</div>
					<button className="flex items-center p-1.5 rounded-md duration-200 hover:bg-zinc-700">
						<Cog8ToothIcon className="w-6 h-6 hover:text-zinc-50" />
					</button>
				</div>
			)}
		</div>
	)
}
