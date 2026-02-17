import z from 'zod'

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']

const isValidImageUrl = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url)
		const pathname = parsedUrl.pathname.toLowerCase()
		return imageExtensions.some(ext => pathname.endsWith(`.${ext}`))
	} catch {
		return false
	}
}

export const createServerSchema = z.object({
	iconUrl: z
		.string()
		.optional()
		.refine(
			val =>
				!val ||
				(z.string().url().safeParse(val).success && isValidImageUrl(val)),
			{
				message:
					'URL must be a valid image link ending with .jpg, .jpeg, .png, .gif, or .webp',
			},
		),
	name: z.string().min(3, 'Too short').max(20, 'Too long'),
})

export type CreateServerData = z.infer<typeof createServerSchema>
