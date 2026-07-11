import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = Router();

// NOTE: technician এর reviews দেখার জন্য আলাদা GET endpoint লাগেনি —
// GET /api/technicians/:id (Day 2, technician module) তে reviewsAsTechnician
// আগে থেকেই include করা আছে।
router.post(
    "/",
    auth(Role.CUSTOMER),
    validateRequest(reviewValidation.createReviewValidationSchema),
    reviewController.createReview
);

export const reviewRoutes = router;
