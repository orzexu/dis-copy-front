import { cn } from '@shared/lib'

type Props = {
	count: number
}

export const UnreadCount = ({ count }: Props) => {
	return (
		<div
			className={cn(
				'w-4 h-4 bg-red-400 rounded-full flex items-center justify-center',
				count === 0 && 'hidden',
			)}
		>
			<p className="text-sm ">{count}</p>
		</div>
	)
}
