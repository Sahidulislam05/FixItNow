import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const { bookingId } = req.body;

    const result = await paymentService.initiatePaymentIntoDB(bookingId, customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment session created successfully",
        data: result
    })
})

// SSLCommerz success/fail/cancel সবগুলো এই একই route এ POST করে (form-urlencoded body + query তে tranId/status)
const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { tranId, status } = req.query;

    const payload = req.body;

    if (!tranId || !status) {
        throw new AppError(httpStatus.BAD_REQUEST, "tranId and status are required in query");
    }

    const result = await paymentService.confirmPaymentInDB(tranId as string, status as string, payload);

    // কোনো frontend নেই বলে JSON রেসপন্স রাখা হলো (থাকলে সাধারণত এখানে frontend URL এ redirect করা হতো)
    sendResponse(res, {
        success: result.status === "PAID",
        statusCode: httpStatus.OK,
        message: result.status === "PAID"
            ? "Payment completed successfully"
            : `Payment ${String(result.status).toLowerCase()}`,
        data: result
    })
})

const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const query = req.query;

    const result = await paymentService.getMyPaymentsFromDB(customerId, query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const role = req.user?.role as Role;

    const paymentId = req.params.id as string;

    if (!paymentId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment ID required in params");
    }

    const payment = await paymentService.getPaymentByIdFromDB(paymentId, userId, role);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment retrieved successfully",
        data: { payment }
    })
})

export const paymentController = {
    createPayment,
    confirmPayment,
    getMyPayments,
    getPaymentById
}
