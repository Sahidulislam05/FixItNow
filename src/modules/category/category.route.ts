import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = Router();

// public
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// admin only
router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(categoryValidation.createCategoryValidationSchema),
    categoryController.createCategory
);

router.patch(
    "/:id",
    auth(Role.ADMIN),
    validateRequest(categoryValidation.updateCategoryValidationSchema),
    categoryController.updateCategory
);

export const categoryRoutes = router;
