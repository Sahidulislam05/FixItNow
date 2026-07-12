import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Category name is required" })
      .trim()
      .min(2, "Category name must be at least 2 characters long")
      .max(100, "Category name can not be more than 100 characters"),
    description: z
      .string()
      .max(500, "Description can not be more than 500 characters")
      .optional(),
    icon: z.string().optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    icon: z.string().optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
