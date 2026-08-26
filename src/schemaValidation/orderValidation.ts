import z from "zod";

export const orderValidation = z.object({
    rentalDate: z.coerce.date().min(1),
    returnDate: z.coerce.date().min(1),
    gearItemId: z.string().min(1)
})

export type TOrderValidation = z.infer<typeof orderValidation>