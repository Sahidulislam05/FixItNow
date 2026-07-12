import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const payload = req.body;

    const booking = await bookingService.createBookingIntoDB(
      customerId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: { booking },
    });
  },
);

const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const query = req.query;

    const result = await bookingService.getMyBookingsFromDB(customerId, query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getBookingById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const role = req.user?.role as Role;

    const bookingId = req.params.id as string;

    if (!bookingId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Booking ID required in params",
      );
    }

    const booking = await bookingService.getBookingByIdFromDB(
      bookingId,
      userId,
      role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking retrieved successfully",
      data: { booking },
    });
  },
);

const cancelBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const bookingId = req.params.id as string;

    if (!bookingId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Booking ID required in params",
      );
    }

    const { cancelReason } = req.body;

    const cancelledBooking = await bookingService.cancelBookingByCustomerInDB(
      bookingId,
      customerId,
      cancelReason,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking cancelled successfully",
      data: { cancelledBooking },
    });
  },
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id as string;
    const bookingId = req.params.id as string;

    if (!bookingId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Booking ID required in params",
      );
    }

    const { status } = req.body;

    const updatedBooking =
      await bookingService.updateBookingStatusByTechnicianInDB(
        bookingId,
        technicianId,
        status,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: `Booking status updated to ${status}`,
      data: { updatedBooking },
    });
  },
);

const getTechnicianBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id as string;

    const query = req.query;

    const result = await bookingService.getTechnicianBookingsFromDB(
      technicianId,
      query,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician bookings retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await bookingService.getAllBookingsFromDB(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All bookings retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getTechnicianBookings,
  getAllBookings,
};
