import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = Router();

router.post(
    "/create",
    auth(Role.CUSTOMER),
    validateRequest(paymentValidation.createPaymentValidationSchema),
    paymentController.createPayment
);

// SSLCommerz সার্ভার নিজে এই route এ কল করে — তাই auth middleware নেই এখানে
router.post("/confirm", paymentController.confirmPayment);

router.get(
    "/",
    auth(Role.CUSTOMER),
    paymentController.getMyPayments
);

router.get(
    "/:id",
    auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
    paymentController.getPaymentById
);

export const paymentRoutes = router;
