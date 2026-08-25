import z from "zod";

export const categoryValidation = z.object({
    name: z.string().min(1)
})