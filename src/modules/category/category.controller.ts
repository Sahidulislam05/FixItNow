import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const category = await categoryService.createCategoryIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: { category }
    })
})

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = req.query.searchTerm as string | undefined;

    const categories = await categoryService.getAllCategoriesFromDB(searchTerm);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories retrieved successfully",
        data: { categories }
    })
})

const getCategoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;

    if (!categoryId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category ID required in params");
    }

    const category = await categoryService.getCategoryByIdFromDB(categoryId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category retrieved successfully",
        data: { category }
    })
})

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;

    if (!categoryId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category ID required in params");
    }

    const payload = req.body;

    const updatedCategory = await categoryService.updateCategoryInDB(categoryId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category updated successfully",
        data: { updatedCategory }
    })
})

export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory
}
