import { ROUTES } from '@app/config'
import { AppButton, Divider } from '@shared/ui'
import { Link } from 'react-router'

type Props = {
	children: React.ReactNode
	type: 'login' | 'register'
	buttonDisabled?: boolean
}

export const AuthLayout: React.FC<Props> = ({
	children,
	type,
	buttonDisabled,
}) => {
	const title = type === 'login' ? 'Login' : 'Registration'
	const bottomText =
		type === 'login' ? 'do not have an account?' : 'already have an account?'
	const bottomLink = type === 'login' ? 'Sign up' : 'Sign in'

	return (
		<div className="bg-zinc-900 w-100 h-max px-2.5 py-3.5 flex justify-center items-center rounded-2xl shadow-app-primary">
			<div className="flex flex-col w-full justify-between items-center">
				<div className="text-2xl font-semibold">{title}</div>
				<Divider />
				{children}
				<AppButton type="submit" text="Submit" disabled={buttonDisabled} />
				<Divider type="horizontal" />
				<div className="flex justify-center items-center gap-1.5">
					<p className="text-sm">{bottomText}</p>
					<Link to={type === 'login' ? ROUTES.register : ROUTES.login}>
						<p className="text-sm text-gray-400 hover:text-cyan-600 ease-in-out duration-150">
							{bottomLink}
						</p>
					</Link>
				</div>
			</div>
		</div>
	)
}
