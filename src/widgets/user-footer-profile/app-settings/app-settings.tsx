import { useGetProfile } from '@features/user'
import { UserIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { cn } from '@shared/lib'
import { Avatar, Divider } from '@shared/ui'
import { PersonalData } from '@widgets/user-footer-profile/app-settings/settings-components/personal-data'
import { useState } from 'react'

type Props = {
	close: () => void
}

export const AppSettings = ({ close }: Props) => {
	const { data: user } = useGetProfile()
	const [activeTab, setActivetab] = useState(0)

	const settingList = [
		{
			title: 'Личные данные',
			icon: <UserIcon className="w-8 h-8" />,
		},
	]

	return (
		<div className="flex h-full">
			<div className="w-full max-w-1/3 p-1">
				<div className="flex items-center gap-2 mb-2">
					<Avatar src={user?.avatarUrl} fallback={user?.username} size="lg" />
					<div className="text-zinc-300 text-lg">{user?.username}</div>
				</div>
				{settingList.map((item, index) => (
					<button
						key={index}
						onClick={() => setActivetab(index)}
						className={cn(
							'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
							activeTab === index
								? 'bg-zinc-700 text-zinc-100'
								: 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
						)}
					>
						<div>{item.icon}</div>
						<div className="text-lg">{item.title}</div>
					</button>
				))}
			</div>
			<Divider type="vertical" />
			<div className="flex w-full flex-col">
				<div className="flex w-full h-10 justify-between items-center pl-1 pr-1 pt-1">
					<div>{settingList[activeTab].title}</div>
					<button
						className="border rounded-md border-transparent hover:border-zinc-700"
						onClick={close}
					>
						<XMarkIcon className="w-8 h-8 text-zinc-600 hover:text-grayscale-100" />
					</button>
				</div>
				<Divider />
				<div className="flex-1 pl-1 pr-1 pb-1">
					{activeTab === 0 && <PersonalData />}
				</div>
			</div>
		</div>
	)
}
