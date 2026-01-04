import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

type Props = {
	label: string
	placeholder?: string
	name: string
	register: UseFormRegister<any>
	error?: FieldError
	type?: 'text' | 'password'
}

export const AppInput: React.FC<Props> = ({
	label,
	placeholder,
	name,
	register,
	error,
	type = 'text',
}) => {
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const inputType = type === 'password' && showPassword ? 'text' : type

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col">
				<label className="text-base font-light">{label}:</label>
				<div className="relative w-full">
					<input
						type={inputType}
						className="w-full rounded-md shadow-app-primary bg-zinc-800 p-1 text-sm placeholder:text-zinc-500 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700"
						placeholder={placeholder}
						{...register(name)}
					/>
					{type === 'password' && (
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center pr-3"
							onClick={() => setShowPassword(!showPassword)}
							aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
						>
							{showPassword ? (
								<EyeSlashIcon className="h-5 w-5 text-zinc-500 hover:text-zinc-300" />
							) : (
								<EyeIcon className="h-5 w-5 text-zinc-500 hover:text-zinc-300" />
							)}
						</button>
					)}
				</div>
				<p className="text-xs text-red-500 ml-1 min-h-8 wrap-break-word">
					{error ? error.message : '\u00A0'}
				</p>
			</div>
		</div>
	)
}
