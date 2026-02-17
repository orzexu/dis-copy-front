import { cn } from '@shared/lib'

type Props = {
	text: string | JSX.Element
	onClick?: () => void
	disabled?: boolean
	className?: string
	type?: 'submit' | 'button'
	style?: 'primary' | 'exit'
}

export const AppButton: React.FC<Props> = ({
	onClick,
	text,
	disabled,
	className,
	type,
	style = 'primary',
}) => {
	return (
		<button
			className={cn(
				style === 'primary' &&
					'w-full rounded-2xl bg-gray-800 py-2 px-4 shadow-app-primary text-zinc-200 font-semibold text-lg ease-in-out duration-150 hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-700 disabled:text-zinc-500',
				style === 'exit' &&
					'w-full rounded-2xl bg-transparent py-2 px-4 border-2 border-red-900 text-red-900 font-semibold text-lg ease-in-out duration-150 hover:bg-red-950/30 active:bg-red-800 disabled:bg-red-700 disabled:text-zinc-500',
				className,
			)}
			onClick={onClick}
			disabled={disabled}
			type={type}
		>
			{text}
		</button>
	)
}
