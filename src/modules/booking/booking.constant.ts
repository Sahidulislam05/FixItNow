import { BookingStatus } from "../../../generated/prisma/enums";

export const BOOKING_STATUS_TRANSITIONS: Record<
  BookingStatus,
  BookingStatus[]
> = {
  REQUESTED: [BookingStatus.ACCEPTED, BookingStatus.DECLINED],
  ACCEPTED: [BookingStatus.PAID],
  DECLINED: [],
  PAID: [BookingStatus.IN_PROGRESS],
  IN_PROGRESS: [BookingStatus.COMPLETED],
  COMPLETED: [],
  CANCELLED: [],
};

export const CANCELLABLE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.REQUESTED,
  BookingStatus.ACCEPTED,
  BookingStatus.PAID,
];

export const TECHNICIAN_SETTABLE_STATUSES: BookingStatus[] = [
  BookingStatus.ACCEPTED,
  BookingStatus.DECLINED,
  BookingStatus.IN_PROGRESS,
  BookingStatus.COMPLETED,
];

export const isValidBookingStatusTransition = (
  currentStatus: BookingStatus,
  nextStatus: BookingStatus,
): boolean => {
  return (
    BOOKING_STATUS_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false
  );
};
