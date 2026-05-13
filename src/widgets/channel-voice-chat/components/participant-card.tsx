import { useIsSpeaking, VideoTrack } from '@livekit/components-react'
import { cn } from '@shared/lib'
import { Avatar } from '@shared/ui'
import { useUsersStore } from '@entities/user/model'
import { Track, type Participant } from 'livekit-client'
import { MicrophoneIcon } from '@heroicons/react/16/solid'

type ParticipantCardProps = {
	participant: Participant
}

export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
	const isSpeaking = useIsSpeaking(participant)
	const { getUserByName } = useUsersStore()
	const user = getUserByName(participant.name || '')
	const avatarUrl = user?.avatarUrl
	const isLocal = participant.isLocal

	const cameraPublication = participant.getTrackPublication(Track.Source.Camera)
	const cameraTrackRef = cameraPublication?.track
		? {
				participant,
				publication: cameraPublication,
				track: cameraPublication.track,
				source: Track.Source.Camera,
			}
		: undefined

	const hasVideo = participant.isCameraEnabled && !!cameraTrackRef

	const isMuted = !participant.isMicrophoneEnabled

	return (
		<div
			className={cn(
				'relative flex flex-col items-center min-h-40 rounded-xl overflow-hidden transition-all duration-200',
				isSpeaking
					? 'ring-2 ring-cyan-400 shadow-lg shadow-green-500/30'
					: 'border border-zinc-700',
			)}
		>
			{isMuted && (
				<MicrophoneIcon className="absolute right-2 bottom-2 w-5 h-5 text-red-600/70 z-10" />
			)}

			{hasVideo ? (
				<div className="relative w-full aspect-video bg-black">
					<VideoTrack
						trackRef={cameraTrackRef}
						className="w-full h-full object-cover"
					/>
					<div className="absolute bottom-1 left-2 right-2 bg-black/50 backdrop-blur-sm rounded-md px-2 py-1 text-white text-sm font-medium truncate">
						{participant.name || participant.identity}
						{isLocal && (
							<span className="ml-1 text-xs text-zinc-300">(Вы)</span>
						)}
					</div>
				</div>
			) : (
				<>
					{avatarUrl ? (
						<div
							className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-110 opacity-60"
							style={{ backgroundImage: `url(${avatarUrl})` }}
						/>
					) : (
						<div className="absolute inset-0 bg-linear-to-br from-zinc-800 to-zinc-900" />
					)}
					<div className="relative z-10 flex flex-col items-center my-auto">
						<Avatar
							size="lg"
							fallback={participant.name || participant.identity}
							src={avatarUrl}
						/>
						<div className="mt-2 text-center">
							<div className="text-white font-medium drop-shadow-lg">
								{participant.name || participant.identity}
							</div>
							{isLocal && (
								<div className="text-xs text-zinc-200 drop-shadow">Вы</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	)
}
