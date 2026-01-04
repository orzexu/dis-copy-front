import { useRegister } from '@features/auth/lib'
import { RegisterFormData, registerSchema } from '@features/auth/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppInput } from '@shared/ui'
import { AuthLayout } from '@widgets/auth'
import { useForm } from 'react-hook-form'

export const RegisterForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: 'onChange',
	})
  const {mutate} = useRegister()

	const onSubmit = (data: RegisterFormData) => {
    mutate(data)
    console.log(data)
		reset()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AuthLayout type="register" buttonDisabled={!isValid}>
				<AppInput
					type="text"
					label="Email"
					placeholder="Enter your email"
					name="email"
					register={register}
					error={errors.email}
				/>
				<AppInput
					type="text"
					label="Username"
					placeholder="Enter your username"
					name="username"
					register={register}
					error={errors.username}
				/>
				<AppInput
					type="password"
					label="Password"
					placeholder="•••"
					name="password"
					register={register}
					error={errors.password}
				/>
				<AppInput
					type="password"
					label="Confirm Password"
					placeholder="•••"
					name="confirmPassword"
					register={register}
					error={errors.confirmPassword}
				/>
			</AuthLayout>
		</form>
	)
}
