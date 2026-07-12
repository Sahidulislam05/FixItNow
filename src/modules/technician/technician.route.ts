import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { technicianController } from "./technician.controller";
import { technicianValidation } from "./technician.validation";

const publicRouter = Router();
const selfRouter = Router();

publicRouter.get("/", technicianController.getAllTechnicians);
publicRouter.get("/:id", technicianController.getTechnicianById);

selfRouter.put(
  "/profile",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateTechnicianProfileValidationSchema),
  technicianController.updateMyTechnicianProfile,
);

selfRouter.put(
  "/availability",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.setAvailabilityValidationSchema),
  technicianController.setMyAvailability,
);

selfRouter.get(
  "/availability",
  auth(Role.TECHNICIAN),
  technicianController.getMyAvailability,
);

export const technicianRoutes = publicRouter;
export const technicianSelfRoutes = selfRouter;
