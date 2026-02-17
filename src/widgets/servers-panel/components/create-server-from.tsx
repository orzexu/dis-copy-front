import { useCreateServer } from '@features/servers-bar/lib'
import {
	CreateServerData,
	createServerSchema,
} from '@features/servers-bar/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppButton, AppInput, LoadingSpinner, useModal } from '@shared/ui'
import { useForm } from 'react-hook-form'

export const CreateServerFrom = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<CreateServerData>({
		resolver: zodResolver(createServerSchema),
		mode: 'onChange',
		reValidateMode: 'onChange',
	})
  const { close } = useModal('add-server')
	const { mutate: createServer, isPending } = useCreateServer()

	const onSubmit = (data: CreateServerData) => {
		createServer(data)
		reset()
    close()
	}

	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<h2 className="font-semibold text-xl">Персонализировать свой сервер</h2>
			<p className="text-center text-wrap">
				Персонализируйте свой новый сервер, выбрав ему название и значок. Их
				можно будет изменить в любой момент.
			</p>
			<form onSubmit={handleSubmit(onSubmit)}>
				<AppInput
					label="Название сервера"
					name="name"
					register={register}
					placeholder="Название сервера"
					error={errors.name}
				/>
				<AppInput
					label="Значок сервера"
					name="iconUrl"
					register={register}
					placeholder="https://dis-copy.com/avatars/..."
					error={errors.iconUrl}
				/>
				{isPending ? (
					<LoadingSpinner className="w-10 h-10" />
				) : (
					<AppButton text={'Создать'} disabled={!isValid} />
				)}
			</form>
		</div>
	)
}
