import z from 'zod'

export const personalDataSchema = z.object({
	avatarUrl: z
		.string()
		.optional()
		.refine(val => !val || z.url().safeParse(val).success, {
			message: 'invalid url',
		}),
	email: z.email('invalid email').optional(),
	username: z.string().min(3, 'Too short').max(20, 'Too long'),
})

export type PersonalDataFormData = z.infer<typeof personalDataSchema>
