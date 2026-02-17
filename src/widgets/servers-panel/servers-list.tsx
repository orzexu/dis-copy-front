import { useUserServers } from '@features/servers-bar/lib'
import { useUiStore } from '@shared/model/ui-store'
import {
	AppModal,
	Divider,
	LoadingSpinner,
	ServerButton,
	useModal,
} from '@shared/ui'
import { AddServerMenu } from '@widgets/servers-panel'
import { useCallback } from 'react'

export const ServersList = () => {
	const { isOpen, open, close } = useModal('add-server')
	const { data: servers, isLoading } = useUserServers()
	const setSelectedServerId = useUiStore(state => state.setSelectedServerId)
	const setSelectedChannelId = useUiStore(state => state.setSelectedChannelId)
	const setMiddlePanel = useUiStore(state => state.setMiddlePanel)

	const handleClickOnServer = useCallback(
		(serverId: number) => {
			setSelectedServerId(serverId)
			setMiddlePanel('channels')
		},
		[setSelectedServerId, setMiddlePanel],
	)

	const handleHomeClick = () => {
		setSelectedServerId(null)
		setSelectedChannelId(null)
		setMiddlePanel('friends')
	}

	return (
		<>
			<div className="flex flex-col gap-2 p-1">
				<ServerButton
					style="home"
					hoverText="На главную"
					onClick={() => handleHomeClick()}
				/>
				<Divider type="horizontal" />
				<ServerButton
					style="create-server"
					hoverText="Добавить сервер"
					onClick={open}
				/>
				{isLoading && <LoadingSpinner className="w-10 h-10" />}
				{!isLoading &&
					servers?.map(server => (
						<div key={server.id}>
							<ServerButton
								style="server-list"
								hoverText={server.name}
								serverLogoLink={server.iconUrl}
								onClick={() => handleClickOnServer(server.id)}
							/>
						</div>
					))}
			</div>

			<AppModal isOpen={isOpen} onClose={close} className="min-w-1/3 h-max">
				<AddServerMenu />
			</AppModal>
		</>
	)
}
