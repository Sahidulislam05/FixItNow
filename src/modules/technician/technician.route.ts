import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { technicianController } from "./technician.controller";
import { technicianValidation } from "./technician.validation";

// ============================================================
// এসাইনমেন্টে দুইটা আলাদা base path আছে technician এর জন্য:
//   /api/technicians   (plural)  -> public browse/detail
//   /api/technician     (singular) -> নিজের profile/availability ম্যানেজ
// তাই এই ফাইল থেকে দুইটা আলাদা router export করা হচ্ছে,
// app.ts এ দুইটা আলাদা path এ মাউন্ট হবে।
// ============================================================

const publicRouter = Router();
const selfRouter = Router();

// ---------- public (mounted at /api/technicians) ----------
publicRouter.get("/", technicianController.getAllTechnicians);
publicRouter.get("/:id", technicianController.getTechnicianById);

// ---------- self-management (mounted at /api/technician) ----------
selfRouter.put(
    "/profile",
    auth(Role.TECHNICIAN),
    validateRequest(technicianValidation.updateTechnicianProfileValidationSchema),
    technicianController.updateMyTechnicianProfile
);

selfRouter.put(
    "/availability",
    auth(Role.TECHNICIAN),
    validateRequest(technicianValidation.setAvailabilityValidationSchema),
    technicianController.setMyAvailability
);

selfRouter.get(
    "/availability",
    auth(Role.TECHNICIAN),
    technicianController.getMyAvailability
);

export const technicianRoutes = publicRouter;
export const technicianSelfRoutes = selfRouter;
