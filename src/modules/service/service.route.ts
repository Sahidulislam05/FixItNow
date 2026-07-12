import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceController } from "./service.controller";
import { serviceValidation } from "./service.validation";

const router = Router();

router.post(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(serviceValidation.createServiceValidationSchema),
  serviceController.createService,
);

router.get("/", serviceController.getAllServices);

router.get(
  "/my-services",
  auth(Role.TECHNICIAN),
  serviceController.getMyServices,
);

router.get("/:id", serviceController.getServiceById);

router.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  validateRequest(serviceValidation.updateServiceValidationSchema),
  serviceController.updateMyService,
);

router.delete("/:id", auth(Role.TECHNICIAN), serviceController.deleteMyService);

export const serviceRoutes = router;
