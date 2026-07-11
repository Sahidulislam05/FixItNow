import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ActiveStatus } from "../../../generated/prisma/enums";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "../booking/booking.service";
import { categoryService } from "../category/category.service";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await adminService.getAllUsersFromDB(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;

    if (!userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "User ID required in params");
    }

    const payload = req.body;

    const updatedUser = await adminService.updateUserStatusInDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: payload.activeStatus === ActiveStatus.BLOCKED
            ? "User banned successfully"
            : "User unbanned successfully",
        data: { updatedUser }
    })
})

// ---- booking.service থেকে reuse ----
const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await bookingService.getAllBookingsFromDB(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All bookings retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

// ---- category.service থেকে reuse (এসাইনমেন্ট টেবিলের /api/admin/categories path মেলানোর জন্য
// থিন alias — মূল public/create লজিক ইতিমধ্যে /api/categories এ আছে, Day 2) ----
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

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
    createCategory
}
