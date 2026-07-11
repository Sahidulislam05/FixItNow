import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { bookingController } from "./booking.controller";
import { bookingValidation } from "./booking.validation";

// ============================================================
// technician module এর মতো এখানেও দুইটা আলাদা router দরকার:
//   /api/bookings              (CUSTOMER-facing, plural)
//   /api/technician/bookings   (TECHNICIAN self-management, singular)
// admin এর get-all বুকিং লজিক admin module থেকে bookingService
// সরাসরি reuse করবে (/api/admin/bookings), তাই এখানে আলাদা router
// লাগছে না।
// ============================================================

const customerRouter = Router();
const technicianRouter = Router();

// ---------- customer-facing (mounted at /api/bookings) ----------
customerRouter.post(
    "/",
    auth(Role.CUSTOMER),
    validateRequest(bookingValidation.createBookingValidationSchema),
    bookingController.createBooking
);

customerRouter.get(
    "/",
    auth(Role.CUSTOMER),
    bookingController.getMyBookings
);

customerRouter.get(
    "/:id",
    auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
    bookingController.getBookingById
);

customerRouter.patch(
    "/:id/cancel",
    auth(Role.CUSTOMER),
    validateRequest(bookingValidation.cancelBookingValidationSchema),
    bookingController.cancelBooking
);

// ---------- technician self-management (mounted at /api/technician/bookings) ----------
technicianRouter.get(
    "/",
    auth(Role.TECHNICIAN),
    bookingController.getTechnicianBookings
);

technicianRouter.patch(
    "/:id",
    auth(Role.TECHNICIAN),
    validateRequest(bookingValidation.updateBookingStatusValidationSchema),
    bookingController.updateBookingStatus
);

export const bookingRoutes = customerRouter;
export const technicianBookingRoutes = technicianRouter;
