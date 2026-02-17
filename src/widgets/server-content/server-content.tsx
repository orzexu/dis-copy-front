import { useUserServers } from '@features/servers-bar/lib'
import { useUiStore } from '@shared/model/ui-store'
import { useModal } from '@shared/ui'
import { ChannelsList } from '@widgets/channels-list'
import { InviteModal } from '@widgets/invite-modal'
import { InviteFriendBtn } from '@widgets/server-content/components/invite-friend-btn'

export const ServerContent = () => {
	const { data: server } = useUserServers()
	const selectedServerId = useUiStore(state => state.selectedServerId)
	const selectedServer = server?.find(s => s.id === selectedServerId)

	const { isOpen, close, open } = useModal('invite-modal')

	if (!selectedServer) {
		return null
	}

	return (
		<>
			<div className="flex flex-col gap-2 p-1">
				<InviteFriendBtn onClick={open} />
				<ChannelsList server={selectedServer} />
			</div>
			<InviteModal
				isOpen={isOpen}
				onClose={close}
				serverId={selectedServer.id}
			/>
		</>
	)
}
