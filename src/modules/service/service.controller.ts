import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id as string;

    const payload = req.body;

    const service = await serviceService.createServiceIntoDB(technicianId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Service created successfully",
        data: { service }
    })
})

const getAllServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await serviceService.getAllServicesFromDB(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Services retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

const getMyServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id as string;

    const services = await serviceService.getMyServicesFromDB(technicianId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My services retrieved successfully",
        data: { services }
    })
})

const getServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = req.params.id as string;

    if (!serviceId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Service ID required in params");
    }

    const service = await serviceService.getServiceByIdFromDB(serviceId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service retrieved successfully",
        data: { service }
    })
})

const updateMyService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id as string;
    const serviceId = req.params.id as string;

    if (!serviceId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Service ID required in params");
    }

    const payload = req.body;

    const updatedService = await serviceService.updateMyServiceInDB(serviceId, technicianId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service updated successfully",
        data: { updatedService }
    })
})

const deleteMyService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id as string;
    const serviceId = req.params.id as string;

    if (!serviceId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Service ID required in params");
    }

    await serviceService.deleteMyServiceFromDB(serviceId, technicianId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service deleted successfully",
        data: null
    })
})

export const serviceController = {
    createService,
    getAllServices,
    getMyServices,
    getServiceById,
    updateMyService,
    deleteMyService
}
