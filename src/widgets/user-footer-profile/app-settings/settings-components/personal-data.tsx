import { UserResponseDto } from '@entities/user/model'
import { useUpdateProfile } from '@features/settings/lib'
import {
	PersonalDataFormData,
	personalDataSchema,
} from '@features/settings/schemas'
import { useGetProfile } from '@features/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppButton, AppInput } from '@shared/ui'
import { useForm } from 'react-hook-form'

export const PersonalData = () => {
	const { data: user } = useGetProfile()
	const { mutate: updateProfile } = useUpdateProfile()

	const onSubmit = (data: PersonalDataFormData) => {
		updateProfile(data, {
			onSuccess: (updatedUser: UserResponseDto) => {
				reset({
					avatarUrl: '',
					email: updatedUser.email,
					username: updatedUser.username,
				})
			},
		})
	}

	const {
		handleSubmit,
		register,
		reset,
		formState: { errors, isValid, isDirty },
	} = useForm<PersonalDataFormData>({
		defaultValues: {
			avatarUrl: '',
			email: user?.email || '',
			username: user?.username || '',
		},
		mode: 'onChange',
		resolver: zodResolver(personalDataSchema),
	})
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="relative h-full">
			<AppInput
				label="Avatar url"
				placeholder="Enter new avatar url"
				name="avatarUrl"
				register={register}
				error={errors.avatarUrl}
			/>
			<AppInput
				label="Email"
				placeholder="Enter new email"
				name="email"
				register={register}
				error={errors.email}
			/>
			<AppInput
				label="Username"
				placeholder="Enter new username"
				name="username"
				register={register}
				error={errors.username}
			/>
			{isDirty && isValid && (
				<div className="absolute right-1 bottom-1">
					<AppButton type="submit" text="Сохранить" className="w-30" />
				</div>
			)}
		</form>
	)
}
