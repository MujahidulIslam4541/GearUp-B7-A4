import { z } from "zod";

export const createGearValidation = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    price: z.coerce.number().positive().multipleOf(0.01),
    imageUrl: z.string().url().max(255).optional(),
    brand: z.string().max(255).optional(),
    quantity: z.number().int().min(0).default(0),
    categoryId: z.string().uuid(),
});

// type infer from zod schema
export type TCreateGearInput = z.infer<typeof createGearValidation>;
