import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";

const updateMyTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedProfile =
      await technicianService.updateMyTechnicianProfileInDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile updated successfully",
      data: { updatedProfile },
    });
  },
);

const setMyAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const { slots } = req.body;

    const availabilities = await technicianService.setMyAvailabilityInDB(
      userId,
      slots,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability updated successfully",
      data: { availabilities },
    });
  },
);

const getMyAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const availabilities =
      await technicianService.getMyAvailabilityFromDB(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability fetched successfully",
      data: { availabilities },
    });
  },
);

const getAllTechnicians = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await technicianService.getAllTechniciansFromDB(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technicians retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getTechnicianById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.params.id as string;

    if (!technicianId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Technician ID required in params",
      );
    }

    const technician =
      await technicianService.getTechnicianByIdFromDB(technicianId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile retrieved successfully",
      data: { technician },
    });
  },
);

export const technicianController = {
  updateMyTechnicianProfile,
  setMyAvailability,
  getMyAvailability,
  getAllTechnicians,
  getTechnicianById,
};
