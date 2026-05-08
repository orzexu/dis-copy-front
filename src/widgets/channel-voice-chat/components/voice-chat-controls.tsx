import {
	ArrowLeftEndOnRectangleIcon,
	ComputerDesktopIcon,
	MicrophoneIcon,
	VideoCameraIcon,
} from '@heroicons/react/16/solid'
import {
	useDisconnectButton,
	useLocalParticipant,
	useTrackToggle,
} from '@livekit/components-react'
import { cn } from '@shared/lib'
import { Track } from 'livekit-client'
import { useState } from 'react'

type Props = {
	onLeave: () => void
}

export const VoiceChatControls = ({ onLeave }: Props) => {
	const { buttonProps: micButtonProps, enabled: micEnabled } = useTrackToggle({
		source: Track.Source.Microphone,
		initialState: true,
	})

	const { buttonProps: cameraButtonProps, enabled: cameraEnabled } =
		useTrackToggle({
			source: Track.Source.Camera,
			initialState: false,
		})

	const { localParticipant } = useLocalParticipant()
	const [isScreenSharing, setIsScreenSharing] = useState(false)

	const toggleScreenShare = async () => {
		try {
			if (isScreenSharing) {
				await localParticipant.setScreenShareEnabled(false)
				setIsScreenSharing(false)
			} else {
				await localParticipant.setScreenShareEnabled(true)
				setIsScreenSharing(true)
			}
		} catch (e) {
			console.error('Ошибка при переключении шаринга экрана', e)
		}
	}

	const { buttonProps: diconnectButtonProps } = useDisconnectButton({
		stopTracks: true,
	})

	const handleLeave = () => {
		diconnectButtonProps.onClick()
		onLeave()
	}
	return (
		<div className="flex gap-2 items-center">
			<div className="flex gap-2 p-2 border-2 border-zinc-500 rounded-full">
				<button
					{...micButtonProps}
					className={cn(
						'p-2 rounded-full hover:bg-zinc-800/50',
						micEnabled ? 'bg-zinc-800' : 'bg-red-500',
					)}
				>
					<MicrophoneIcon
						className={cn('w-8 h-8', !micEnabled && 'text-red-900')}
					/>
				</button>

				<button
					{...cameraButtonProps}
					className={cn(
						'p-2 rounded-full hover:bg-zinc-800/50',
						cameraEnabled ? 'bg-zinc-700' : 'bg-zinc-800',
					)}
				>
					<VideoCameraIcon className="w-8 h-8" />
				</button>

				<button
					onClick={toggleScreenShare}
					className={cn(
						'p-2 rounded-full hover:bg-zinc-800/50',
						isScreenSharing ? 'bg-green-600' : 'bg-zinc-800',
					)}
				>
					<ComputerDesktopIcon className="w-8 h-8" />
				</button>
			</div>
			<button
				onClick={handleLeave}
				className="px-4 py-2 rounded-full bg-red-500"
			>
				<ArrowLeftEndOnRectangleIcon className="w-8 h-8" />
			</button>
		</div>
	)
}
