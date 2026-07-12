import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { bookingController } from "./booking.controller";
import { bookingValidation } from "./booking.validation";

const customerRouter = Router();
const technicianRouter = Router();

customerRouter.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(bookingValidation.createBookingValidationSchema),
  bookingController.createBooking,
);

customerRouter.get("/", auth(Role.CUSTOMER), bookingController.getMyBookings);

customerRouter.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getBookingById,
);

customerRouter.patch(
  "/:id/cancel",
  auth(Role.CUSTOMER),
  validateRequest(bookingValidation.cancelBookingValidationSchema),
  bookingController.cancelBooking,
);

technicianRouter.get(
  "/",
  auth(Role.TECHNICIAN),
  bookingController.getTechnicianBookings,
);

technicianRouter.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  validateRequest(bookingValidation.updateBookingStatusValidationSchema),
  bookingController.updateBookingStatus,
);

export const bookingRoutes = customerRouter;
export const technicianBookingRoutes = technicianRouter;
