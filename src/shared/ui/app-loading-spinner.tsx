import { cn } from '@shared/lib'

type Props = {
	className?: string
}

export const LoadingSpinner = ({ className }: Props) => {
	return (
		<div className="flex justify-center items-center">
			<div
				className={cn(
					'animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-400',
					className
				)}
			></div>
		</div>
	)
}
