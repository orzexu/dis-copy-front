import { ArrowsPointingOutIcon } from '@heroicons/react/16/solid'
import { TrackReference, VideoTrack } from '@livekit/components-react'
import { useRef } from 'react'

type Props = {
	trackRef: TrackReference
	participantName: string
}

export const ScreenShareCard = ({ participantName, trackRef }: Props) => {
	const videoRef = useRef<HTMLVideoElement>(null)

	const handleFullscreen = () => {
		if (videoRef.current) {
			if (document.fullscreenElement) {
				document.exitFullscreen()
			} else {
				videoRef.current.requestFullscreen()
			}
		}
	}
	return (
		<div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group">
			<VideoTrack
				trackRef={trackRef}
				ref={videoRef}
				className="w-full h-full object-contain"
			/>
			<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
				<span className="text-white text-sm font-medium bg-black/20 px-3 py-2 rounded-md">
					{participantName}
				</span>
				<button
					onClick={handleFullscreen}
					className="p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
					title="На весь экран"
				>
					<ArrowsPointingOutIcon className="w-5 h-5 text-white" />
				</button>
			</div>
		</div>
	)
}
