import { ArrowLeftIcon } from '@heroicons/react/16/solid'

type Props = {
	onClick: () => void
}

export const BackButton = ({ onClick }: Props) => {
	return (
		<button
			className="rounded-full bg-zinc-800 p-1 hover:bg-gray-800"
			onClick={onClick}
		>
			<ArrowLeftIcon className="w-6 h-6" />
		</button>
	)
}
