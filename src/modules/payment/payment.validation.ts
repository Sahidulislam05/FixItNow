import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    bookingId: z
      .string({ required_error: "Booking ID is required" })
      .uuid("Invalid booking ID"),
  }),
});

export const paymentValidation = {
  createPaymentValidationSchema,
};
