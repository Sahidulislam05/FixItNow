import httpStatus from "http-status";
import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { BookingWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import {
  CANCELLABLE_BOOKING_STATUSES,
  isValidBookingStatusTransition,
} from "./booking.constant";
import { ICreateBookingPayload, IBookingQuery } from "./booking.interface";

const createBookingIntoDB = async (
  customerId: string,
  payload: ICreateBookingPayload,
) => {
  const { serviceId, scheduledDate, address } = payload;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service || !service.isActive) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service not found or is currently unavailable",
    );
  }

  if (service.technicianId === customerId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not book your own service",
    );
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId: service.id,
      scheduledDate: new Date(scheduledDate),
      address,
      totalPrice: service.price,
    },
    include: {
      service: { include: { category: true } },
      technician: { omit: { password: true } },
    },
  });

  return booking;
};

const getMyBookingsFromDB = async (
  customerId: string,
  query: IBookingQuery,
) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: BookingWhereInput[] = [{ customerId }];

  if (query.status) {
    andConditions.push({ status: query.status });
  }

  const bookings = await prisma.booking.findMany({
    where: { AND: andConditions },

    take: limit,
    skip: skip,

    orderBy: { createdAt: "desc" },

    include: {
      service: { include: { category: true } },
      technician: { omit: { password: true } },
    },
  });

  const total = await prisma.booking.count({
    where: { AND: andConditions },
  });

  return {
    data: bookings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getBookingByIdFromDB = async (
  bookingId: string,
  userId: string,
  role: Role,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      service: { include: { category: true } },
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
      payments: true,
      review: true,
    },
  });

  const isOwner =
    booking.customerId === userId || booking.technicianId === userId;

  if (role !== Role.ADMIN && !isOwner) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to view this booking",
    );
  }

  return booking;
};

const updateBookingStatusByTechnicianInDB = async (
  bookingId: string,
  technicianId: string,
  nextStatus: BookingStatus,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.technicianId !== technicianId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not the technician assigned to this booking",
    );
  }

  if (!isValidBookingStatusTransition(booking.status, nextStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Booking status can not be changed from ${booking.status} to ${nextStatus}`,
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: nextStatus },
    include: {
      service: { include: { category: true } },
      customer: { omit: { password: true } },
    },
  });

  return updatedBooking;
};

const cancelBookingByCustomerInDB = async (
  bookingId: string,
  customerId: string,
  cancelReason?: string,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not the owner of this booking",
    );
  }

  if (!CANCELLABLE_BOOKING_STATUSES.includes(booking.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Booking can not be cancelled once it is ${booking.status}`,
    );
  }

  const cancelledBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELLED,
      cancelReason: cancelReason || "Cancelled by customer",
    },
  });

  return cancelledBooking;
};

const getTechnicianBookingsFromDB = async (
  technicianId: string,
  query: IBookingQuery,
) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: BookingWhereInput[] = [{ technicianId }];

  if (query.status) {
    andConditions.push({ status: query.status });
  }

  const bookings = await prisma.booking.findMany({
    where: { AND: andConditions },

    take: limit,
    skip: skip,

    orderBy: { createdAt: "desc" },

    include: {
      service: { include: { category: true } },
      customer: { omit: { password: true } },
    },
  });

  const total = await prisma.booking.count({
    where: { AND: andConditions },
  });

  return {
    data: bookings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAllBookingsFromDB = async (query: IBookingQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: BookingWhereInput[] = [];

  if (query.status) {
    andConditions.push({ status: query.status });
  }

  const whereClause = andConditions.length ? { AND: andConditions } : undefined;

  const bookings = await prisma.booking.findMany({
    where: whereClause,

    take: limit,
    skip: skip,

    orderBy: { createdAt: "desc" },

    include: {
      service: { include: { category: true } },
      customer: { omit: { password: true } },
      technician: { omit: { password: true } },
    },
  });

  const total = await prisma.booking.count({ where: whereClause });

  return {
    data: bookings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const bookingService = {
  createBookingIntoDB,
  getMyBookingsFromDB,
  getBookingByIdFromDB,
  updateBookingStatusByTechnicianInDB,
  cancelBookingByCustomerInDB,
  getTechnicianBookingsFromDB,
  getAllBookingsFromDB,
};
