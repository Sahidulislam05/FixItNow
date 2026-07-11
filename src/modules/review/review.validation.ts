import { z } from "zod";

const createReviewValidationSchema = z.object({
    body: z.object({
        bookingId: z.string({ required_error: "Booking ID is required" }).uuid("Invalid booking ID"),
        rating: z
            .number({ required_error: "Rating is required" })
            .int("Rating must be a whole number")
            .min(1, "Rating must be between 1 and 5")
            .max(5, "Rating must be between 1 and 5"),
        comment: z.string().max(1000, "Comment can not be more than 1000 characters").optional(),
    }),
});

export const reviewValidation = {
    createReviewValidationSchema,
};
