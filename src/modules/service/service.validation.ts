import { z } from "zod";

const createServiceValidationSchema = z.object({
  body: z.object({
    categoryId: z
      .string({ required_error: "Category ID is required" })
      .uuid("Invalid category ID"),
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(2, "Title must be at least 2 characters long")
      .max(255, "Title can not be more than 255 characters"),
    description: z
      .string()
      .max(2000, "Description can not be more than 2000 characters")
      .optional(),
    price: z
      .number({ required_error: "Price is required" })
      .positive("Price must be a positive number"),
    location: z.string().trim().optional(),
  }),
});

const updateServiceValidationSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid("Invalid category ID").optional(),
    title: z.string().trim().min(2).max(255).optional(),
    description: z.string().max(2000).optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    location: z.string().trim().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const serviceValidation = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};
