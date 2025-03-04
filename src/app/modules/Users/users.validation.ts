import z from "zod";

const userValidationSchema = z.object({
    body: z.object({
        userName: z.string().min(3).max(30),
        email: z.string().email(),
        password: z.string().min(6).max(30),
    }),
});

export const validateUser = { userValidationSchema };