import { useUpdateServer } from '@features/server/lib'
import { useUserServers } from '@features/servers-bar/lib'
import { ServerIconUpload } from '@features/servers-bar/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppButton, AppInput, AppModal, LoadingSpinner } from '@shared/ui'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const updateServerSchema = z.object({
	name: z.string().min(1, 'Название не может быть пустым'),
})

type UpdateServerFormData = z.infer<typeof updateServerSchema>

type Props = {
	isOpen: boolean
	onClose: () => void
	serverId: number
}

export const ServerSettingsModal = ({ isOpen, onClose, serverId }: Props) => {
	const { mutate: updateServer, isPending } = useUpdateServer()

	const { data: servers } = useUserServers()
	const server = servers?.find(s => s.id === serverId)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
	} = useForm<UpdateServerFormData>({
		defaultValues: {
			name: server?.name || '',
		},
		resolver: zodResolver(updateServerSchema),
		mode: 'onChange',
	})

  useEffect(() => {
		reset({
			name: server?.name || '',
		})
	}, [server, reset])

	const onSubmit = (data: UpdateServerFormData) => {
		updateServer(
			{ serverId, data: { name: data.name } },
			{
				onSuccess: () => {
					reset({ name: data.name })
					onClose()
				},
			},
		)
	}

	if (!server) return null

	return (
		<AppModal isOpen={isOpen} onClose={onClose}>
			<div className="flex flex-col gap-4 p-4">
				<h2 className="text-xl font-semibold">Настройки сервера</h2>
				<div className="flex flex-col items-center">
					<ServerIconUpload
						serverId={serverId}
						currentIconUrl={server.iconUrl}
						serverName={server.name}
					/>
					<p className="text-xs text-zinc-400 mt-1">
						Нажмите на иконку, чтобы изменить
					</p>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
					<AppInput
						label="Название сервера"
						name="name"
						register={register}
						placeholder="Название сервера"
						error={errors.name}
					/>
					<div className="flex justify-end gap-2">
						<AppButton type="button" onClick={onClose} text="Отмена" />
						<AppButton
							type="submit"
							disabled={!isDirty || !isValid || isPending}
							text={
								isPending ? <LoadingSpinner className="w-5 h-5" /> : 'Сохранить'
							}
						/>
					</div>
				</form>
			</div>
		</AppModal>
	)
}
