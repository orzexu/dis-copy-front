import { useGenerateServerInvite } from '@features/join-server/lib'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { AppButton, AppModal } from '@shared/ui'
import { useEffect, useState } from 'react'

type Props = {
	serverId: number
	isOpen: boolean
	onClose: () => void
}

export const InviteModal = ({ isOpen, onClose, serverId }: Props) => {
	const [inviteCode, setInviteCode] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const { mutate: generateInvite, isPending } = useGenerateServerInvite()

  useEffect(() => {
    setInviteCode(null)
    setError(null)
  }, [serverId])

  useEffect(() => {
    if (isOpen) {
      setError(null)
    }
  }, [isOpen])

	const handleGenerate = () => {
		generateInvite(serverId, {
			onSuccess: response => {
				setInviteCode(response.code)
        setError(null)
			},
			onError: () => {
				setError('you have no permission to generate invite')
			},
		})
	}

	const handleCopy = () => {
		if (inviteCode) {
			navigator.clipboard.writeText(
				`${window.location.origin}/join/${inviteCode}`,
			)
		}
	}

	const handleRegenerate = () => {
		setInviteCode(null)
	}

	return (
		<AppModal isOpen={isOpen} onClose={onClose}>
			<button
				className="absolute right-1 top-1 hover:text-white"
				onClick={onClose}
			>
				<XMarkIcon className="w-6 h-6" />
			</button>
			<div className="p-4">
				<h2 className="text-lg font-semibold mb-4">Server Invite</h2>

				{inviteCode ? (
					<div className="space-y-4">
						<div className="bg-zinc-800 p-3 rounded text-center font-mono">
							{`${window.location.origin}/join/${inviteCode}`}
						</div>

						<div className="flex gap-2">
							<AppButton text="Copy Link" onClick={handleCopy} />

							<AppButton
								text="Regenerate"
								style="exit"
								onClick={handleRegenerate}
							/>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<p className="text-zinc-400">
							Generate an invite link to share with friends
						</p>

						<AppButton
							text={isPending ? 'Generating...' : 'Generate Invite'}
							onClick={handleGenerate}
							disabled={isPending || error !== null}
							className="w-full"
						/>
					</div>
				)}
				{error && <p className="text-red-500 text-xs mt-1">{error}</p>}

				<div className="mt-4 text-xs text-zinc-500">
					Invite link expires in 7 days
				</div>
			</div>
		</AppModal>
	)
}
