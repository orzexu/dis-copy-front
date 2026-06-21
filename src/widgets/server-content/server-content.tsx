import { useUserServers } from '@features/servers-bar/lib'
import { useUiStore } from '@shared/model/ui-store'
import { Divider, useModal } from '@shared/ui'
import { ChannelsList } from '@widgets/channels-list'
import { InviteModal } from '@widgets/invite-modal'
import { InviteFriendBtn } from '@widgets/server-content/components/invite-friend-btn'
import { ServerSettingsBtn } from '@widgets/server-content/components/server-settings-btn'
import { ServerSettingsModal } from '@widgets/server-content/components/server-settings-modal'

export const ServerContent = () => {
	const { data: server } = useUserServers()
	const selectedServerId = useUiStore(state => state.selectedServerId)
	const selectedServer = server?.find(s => s.id === selectedServerId)

	const {
		isOpen: isOpenInviteModal,
		close: closeInviteModal,
		open: openInviteModal,
	} = useModal('invite-modal')
	const {
		isOpen: isOpenServerSettingsModal,
		close: closeServerSettingsModal,
		open: openServerSettingsModal,
	} = useModal('server-settings-modal')

	if (!selectedServer) {
		return null
	}

	return (
		<>
			<div className="flex flex-col gap-2 p-1">
				<ServerSettingsBtn onClick={openServerSettingsModal} />
				<InviteFriendBtn onClick={openInviteModal} />

				<Divider />

				<ChannelsList server={selectedServer} />
			</div>
			<InviteModal
				isOpen={isOpenInviteModal}
				onClose={closeInviteModal}
				serverId={selectedServer.id}
			/>
			<ServerSettingsModal
				serverId={selectedServer.id}
				isOpen={isOpenServerSettingsModal}
				onClose={closeServerSettingsModal}
			/>
		</>
	)
}
