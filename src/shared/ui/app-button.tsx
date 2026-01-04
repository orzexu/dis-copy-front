type Props = {
	text: string
	onClick?: () => void
	disabled?: boolean
	className?: string
	type?: 'submit' | 'button'
}

export const AppButton: React.FC<Props> = ({
	onClick,
	text,
	disabled,
	className,
	type,
}) => {
	return (
		<button
			className={`${className} 
      w-full rounded-2xl bg-gray-800 py-2 px-4 shadow-app-primary
      text-zinc-200 font-semibold text-lg ease-in-out duration-150
      hover:bg-gray-900 active:bg-gray-800
      disabled:bg-gray-700 disabled:text-zinc-500
      `}
			onClick={onClick}
			disabled={disabled}
			type={type}
		>
			{text}
		</button>
	)
}
