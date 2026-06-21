import { CogIcon } from "@heroicons/react/16/solid"

type Props = {
	onClick: () => void
}
export const ServerSettingsBtn = ({ onClick }: Props) => {
	return (
		<button
			className="flex gap-2 items-center p-2 rounded hover:bg-zinc-700 transition-colors"
			onClick={onClick}
		>
			<CogIcon className="w-6 h-6" />
			<p>Server settings</p>
		</button>
	)
}
