import { useLogin } from '@features/auth/lib'
import { LoginFormData, loginSchema } from '@features/auth/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppInput } from '@shared/ui'
import { AuthLayout } from '@widgets/auth'
import { useForm } from 'react-hook-form'

export const LoginForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
	})
  const { mutate, isPending } = useLogin()

	const onSubmit = (data: LoginFormData) => {
		mutate(data)
		reset()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<AuthLayout type="login" buttonDisabled={!isValid || isPending}>
				<AppInput
					type="text"
					label="Email"
					placeholder="Enter your email"
					name="email"
					register={register}
					error={errors.email}
				/>
				<AppInput
					type="password"
					label="Password"
					placeholder="•••"
					name="password"
					register={register}
					error={errors.password}
				/>
			</AuthLayout>
		</form>
	)
}
