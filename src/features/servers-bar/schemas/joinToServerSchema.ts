import z from "zod";

export const joinToServerSchema = z.object({
  inviteLink: z.url(),
})

export type JoinToServerData = z.infer<typeof joinToServerSchema>