import { z } from 'zod'

export const loginSchema = z.object({
	email: z.email('Invalid email'),
	password: z
		.string()
		.min(6, 'Too short')
		.max(20, 'Too long')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		),
})

export type LoginFormData = z.infer<typeof loginSchema>
