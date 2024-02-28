import {z} from 'zod'

export const SendMessageValidators = z.object({
    fileId: z.string(),
    message: z.string()
})