import z from 'zod'

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();
    return imageExtensions.some(ext => pathname.endsWith(`.${ext}`));
  } catch {
    return false;
  }
};

export const personalDataSchema = z.object({
	avatarUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || (z.string().url().safeParse(val).success && isValidImageUrl(val)),
      {
        message: 'URL must be a valid image link ending with .jpg, .jpeg, .png, .gif, or .webp',
      }
    ),
	email: z.email('invalid email').optional(),
	username: z.string().min(3, 'Too short').max(20, 'Too long'),
})

export type PersonalDataFormData = z.infer<typeof personalDataSchema>
