import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router = Router();

router.post(
    "/login",
    validateRequest(authValidation.loginValidationSchema),
    authController.loginUser
)

router.post("/refresh-token", authController.refreshToken)

export const authRoutes = router;
