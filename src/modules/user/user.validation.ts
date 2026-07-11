import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";

// রেজিস্ট্রেশনে শুধু CUSTOMER / TECHNICIAN বেছে নেওয়া যাবে।
// ADMIN কখনো public register endpoint দিয়ে তৈরি হবে না — সেটা শুধু seed.ts থেকেই আসবে।
const registerUserValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: "Name is required" })
            .trim()
            .min(2, "Name must be at least 2 characters long")
            .max(255, "Name can not be more than 255 characters"),
        email: z
            .string({ required_error: "Email is required" })
            .trim()
            .email("Please provide a valid email address"),
        password: z
            .string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters long"),
        phone: z.string().trim().optional(),
        role: z.enum([Role.CUSTOMER, Role.TECHNICIAN]).optional(),
    }),
});

const updateProfileValidationSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(255).optional(),
        phone: z.string().trim().optional(),
    }),
});

export const userValidation = {
    registerUserValidationSchema,
    updateProfileValidationSchema,
};
