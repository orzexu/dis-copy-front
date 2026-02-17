import { useJoinServerByInvite } from '@features/join-server/lib'
import {
	JoinToServerData,
	joinToServerSchema,
} from '@features/servers-bar/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppButton, AppInput, useModal } from '@shared/ui'
import { useForm } from 'react-hook-form'

export const JoinToServer = () => {
	const { close } = useModal('add-server')
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<JoinToServerData>({
		resolver: zodResolver(joinToServerSchema),
		mode: 'onChange',
		reValidateMode: 'onChange',
	})
	const { mutate: joinToServerInvite } = useJoinServerByInvite()

	const onSubmit = (data: JoinToServerData) => {
		joinToServerInvite(data.inviteLink.slice(-8))
		close()
	}

	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<h2 className="text-xl font-semibold">Присоедениться к серверу</h2>
			<p className="text-center text-wrap">
				Введите приглашение, чтобы присоедениться к существующему серверу
			</p>
			<form onSubmit={handleSubmit(onSubmit)}>
				<AppInput
					label="Ссылка-приглашение"
					name="inviteLink"
					register={register}
					placeholder="https://dis-copy.com/invite/..."
					error={errors.inviteLink}
				/>
				<AppButton text="Присоедениться" type="submit" disabled={!isValid} />
			</form>
		</div>
	)
}
