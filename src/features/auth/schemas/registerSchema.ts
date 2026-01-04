import { z } from 'zod'

export const registerSchema = z
	.object({
		email: z.email('Invalid email'),
		username: z.string().min(3, 'Too short').max(20, 'Too long'),
		password: z
			.string()
			.min(6, 'Too short')
			.max(20, 'Too long')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
			),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

  export type RegisterFormData = z.infer<typeof registerSchema>
