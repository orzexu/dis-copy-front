import {
	ChangePasswordFormData,
	changePasswordSchema,
} from '@features/settings/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePassword } from '@shared/api/user-api'
import { AppButton, AppInput } from '@shared/ui'
import { useForm } from 'react-hook-form'

export const SecuritySettings = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty },
	} = useForm<ChangePasswordFormData>({
		defaultValues: {
			oldPass: '',
			newPass: '',
			confNewPass: '',
		},
		resolver: zodResolver(changePasswordSchema),
		mode: 'onChange',
	})

	const onSubmit = (data: ChangePasswordFormData) => {
		const { confNewPass, ...dataToSend } = data
		changePassword(dataToSend)
		reset()
	}

	return (
		<div className="flex flex-col">
			<div className="text-lg text-zinc-300">Смена пароля</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-2 px-2"
			>
				<AppInput
					label="Старый пароль"
					name="oldPass"
					placeholder="Введите старый пароль"
					type="password"
					register={register}
					error={errors.oldPass}
				/>
				<AppInput
					label="Новый пароль"
					name="newPass"
					placeholder="Введите новый пароль"
					type="password"
					register={register}
					error={errors.newPass}
				/>
				<AppInput
					label="Подтвердите новый пароль"
					name="confNewPass"
					placeholder="Введите новый пароль еще раз"
					type="password"
					register={register}
					error={errors.confNewPass}
				/>
				{isDirty && isValid && (
					<div className="absolute right-1 bottom-1">
						<AppButton type="submit" text="Сохранить" className="w-30" />
					</div>
				)}
			</form>
		</div>
	)
}
