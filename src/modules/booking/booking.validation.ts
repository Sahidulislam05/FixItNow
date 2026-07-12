import { z } from "zod";
import { BookingStatus } from "../../../generated/prisma/enums";
import { TECHNICIAN_SETTABLE_STATUSES } from "./booking.constant";

const createBookingValidationSchema = z.object({
  body: z.object({
    serviceId: z
      .string({ required_error: "Service ID is required" })
      .uuid("Invalid service ID"),
    scheduledDate: z.coerce
      .date({ required_error: "Scheduled date is required" })
      .refine((date) => date.getTime() > Date.now(), {
        message: "Scheduled date must be in the future",
      }),
    address: z
      .string({ required_error: "Address is required" })
      .trim()
      .min(5, "Address must be at least 5 characters long"),
  }),
});

const updateBookingStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(
      TECHNICIAN_SETTABLE_STATUSES as [BookingStatus, ...BookingStatus[]],
      { required_error: "Status is required" },
    ),
  }),
});

const cancelBookingValidationSchema = z.object({
  body: z.object({
    cancelReason: z
      .string()
      .trim()
      .max(500, "Cancel reason can not be more than 500 characters")
      .optional(),
  }),
});

export const bookingValidation = {
  createBookingValidationSchema,
  updateBookingStatusValidationSchema,
  cancelBookingValidationSchema,
};
