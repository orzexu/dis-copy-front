import {
	useRemoteParticipants,
	useLocalParticipant,
	useTracks,
} from '@livekit/components-react'
import { ParticipantCard } from '@widgets/channel-voice-chat/components/participant-card'
import { ScreenShareCard } from '@widgets/channel-voice-chat/components/screenshare-card'
import { Track } from 'livekit-client'

export const ParticipantsList = () => {
	const remoteParticipants = useRemoteParticipants()
	const { localParticipant } = useLocalParticipant()

	const allParticipants = [localParticipant, ...remoteParticipants].filter(
		Boolean,
	)

	const screenTracks = useTracks([Track.Source.ScreenShare])

	if (allParticipants.length === 0) {
		return <div className="text-zinc-500 text-center">Никого нет в канале</div>
	}

	return (
		<div className="flex flex-col gap-4 h-full overflow-y-auto p-2">
			{screenTracks.length > 0 && (
				<div className="grid grid-cols-1 gap-4">
					{screenTracks.map(trackRef => (
						<ScreenShareCard
							key={
								trackRef.publication?.trackSid || trackRef.participant.identity
							}
							trackRef={trackRef}
							participantName={
								trackRef.participant.name || trackRef.participant.identity
							}
						/>
					))}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{allParticipants.map(participant => (
					<ParticipantCard
						key={participant.identity}
						participant={participant}
					/>
				))}
			</div>
		</div>
	)
}
