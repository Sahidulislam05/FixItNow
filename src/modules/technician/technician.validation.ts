import { z } from "zod";
import { DayOfWeek } from "../../../generated/prisma/enums";

const updateTechnicianProfileValidationSchema = z.object({
  body: z.object({
    bio: z
      .string()
      .max(1000, "Bio can not be more than 1000 characters")
      .optional(),
    experienceYears: z
      .number()
      .int()
      .min(0, "Experience years can not be negative")
      .optional(),
    skills: z.array(z.string()).optional(),
  }),
});

const HH_MM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const setAvailabilityValidationSchema = z.object({
  body: z.object({
    slots: z
      .array(
        z.object({
          dayOfWeek: z.enum([
            DayOfWeek.SATURDAY,
            DayOfWeek.SUNDAY,
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
          ]),
          startTime: z
            .string()
            .regex(
              HH_MM_REGEX,
              "startTime must be in HH:mm format, e.g. 09:00",
            ),
          endTime: z
            .string()
            .regex(HH_MM_REGEX, "endTime must be in HH:mm format, e.g. 17:00"),
          isActive: z.boolean().optional(),
        }),
      )
      .min(1, "At least one availability slot is required"),
  }),
});

export const technicianValidation = {
  updateTechnicianProfileValidationSchema,
  setAvailabilityValidationSchema,
};
