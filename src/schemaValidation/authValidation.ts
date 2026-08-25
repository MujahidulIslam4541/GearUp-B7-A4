
import { z } from "zod";

export const createUserValidationSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["user", "provider"]),
});

export const loginValidationSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),

});