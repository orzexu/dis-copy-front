import { TTypeChannel } from '@entities/channel/model'
import { TServer } from '@entities/server/model'
import { SpeakerWaveIcon } from '@heroicons/react/16/solid'
import { cn } from '@shared/lib'
import { useUiStore } from '@shared/model/ui-store'
import { ChannelParticipantsBadge } from '@widgets/channels-list/ui/channel-participants-badge'
import { ChannelParticipantsList } from '@widgets/channels-list/ui/channel-participants-list'

type Props = {
	server: TServer
}

export const ChannelsList = ({ server }: Props) => {
	const setSelectedChannelId = useUiStore(state => state.setSelectedChannelId)
	const setMainPanel = useUiStore(state => state.setMainPanel)
	const selectedChannelId = useUiStore(state => state.selectedChannelId)

	const handleClickOnChannel = (
		channelId: number,
		channelType: TTypeChannel,
	) => {
		setSelectedChannelId(channelId)
		setMainPanel(
			channelType === 'text' ? 'channelTextChat' : 'channelVoiceChat',
		)
	}

	return (
		<>
			{server.channels.map(channel => (
				<div>
					<div
						key={channel.id}
						className={cn(
							'p-2 rounded cursor-pointer flex items-center',
							'hover:bg-zinc-700 transition-colors',
							selectedChannelId === channel.id &&
								'bg-zinc-700/50 text-zinc-200',
							channel.type === 'voice' && 'py-4',
						)}
						onClick={() => handleClickOnChannel(channel.id, channel.type)}
					>
						<div className="flex items-center gap-1">
							<span className="text-zinc-400">
								{channel.type === 'text' ? (
									'#'
								) : (
									<SpeakerWaveIcon className="w-4 h-4" />
								)}
							</span>
							<span className="truncate">{channel.name}</span>
						</div>
						{channel.type === 'voice' && (
							<div className="ml-auto">
								<ChannelParticipantsBadge channelId={channel.id} />
							</div>
						)}
					</div>
					{channel.type === 'voice' && (
						<ChannelParticipantsList channelId={channel.id} />
					)}
				</div>
			))}
		</>
	)
}
