import z from 'zod'

export const changePasswordSchema = z
	.object({
		oldPass: z
			.string()
			.min(6, 'Too short')
			.max(20, 'Too long')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			),
		newPass: z
			.string()
			.min(6, 'Too short')
			.max(20, 'Too long')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			),
		confNewPass: z.string(),
	})
	.refine(data => data.newPass === data.confNewPass, {
		message: 'Passwords do not match',
		path: ['confNewPass'],
	})
	.refine(data => data.newPass !== data.oldPass, {
		message: 'New password must be different from the old password',
		path: ['newPass'],
	})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
