import { CheckIcon } from '@heroicons/react/16/solid'
import { cn } from '@shared/lib'

type Props = {
	content: string
	time: string
	isOwn: boolean
	isRead?: boolean
	className?: string
}

export const AppMessage = ({
	content,
	time,
	isOwn,
	isRead,
	className,
}: Props) => {
	return (
		<div
			className={cn(
				'flex max-w-[80%]',
				isOwn ? 'ml-auto' : 'mr-auto',
				className
			)}
		>
			<div
				className={cn(
					'rounded-2xl px-4 py-3',
					isOwn
						? 'bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
						: 'bg-gray-100 text-gray-900 rounded-bl-sm border-gray-200'
				)}
			>
				<p className="whitespace-pre-wrap wrap-break-word text-sm">{content}</p>
				<div
					className={cn(
						'flex items-center gap-1 mt-2 text-xs',
						isOwn ? 'text-blue-200' : 'text-gray-500'
					)}
				>
					<span>{time}</span>
					{isOwn && isRead && <CheckIcon className="w-3 h-3" />}
				</div>
			</div>
		</div>
	)
}
