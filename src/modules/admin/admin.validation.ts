import { z } from "zod";
import { ActiveStatus } from "../../../generated/prisma/enums";

const updateUserStatusValidationSchema = z.object({
  body: z.object({
    activeStatus: z.enum([ActiveStatus.ACTIVE, ActiveStatus.BLOCKED], {
      required_error: "activeStatus is required",
    }),
  }),
});

export const adminValidation = {
  updateUserStatusValidationSchema,
};
