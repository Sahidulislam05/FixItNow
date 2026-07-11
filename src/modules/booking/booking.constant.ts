import { BookingStatus } from "../../../generated/prisma/enums";

// ============================================================
// Booking status state machine — এসাইনমেন্টের ডায়াগ্রাম অনুযায়ী:
// REQUESTED -> ACCEPTED / DECLINED
// ACCEPTED  -> PAID          (শুধু payment.service থেকে, ম্যানুয়ালি না)
// PAID      -> IN_PROGRESS
// IN_PROGRESS -> COMPLETED
// CANCELLED শুধু customer-initiated, IN_PROGRESS শুরুর আগ পর্যন্ত যেকোনো
// status থেকে হতে পারে — তাই এটা এই ম্যাপে নেই, আলাদাভাবে হ্যান্ডেল হয়।
// ============================================================
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    REQUESTED: [BookingStatus.ACCEPTED, BookingStatus.DECLINED],
    ACCEPTED: [BookingStatus.PAID],
    DECLINED: [],
    PAID: [BookingStatus.IN_PROGRESS],
    IN_PROGRESS: [BookingStatus.COMPLETED],
    COMPLETED: [],
    CANCELLED: [],
};

// এসাইনমেন্টের নোট: "Customers can cancel a booking at any point before it reaches IN_PROGRESS status."
export const CANCELLABLE_BOOKING_STATUSES: BookingStatus[] = [
    BookingStatus.REQUESTED,
    BookingStatus.ACCEPTED,
    BookingStatus.PAID,
];

// টেকনিশিয়ান ম্যানুয়ালি যেসব status এ সেট করতে পারবে — PAID এখানে ইচ্ছাকৃতভাবে নেই
export const TECHNICIAN_SETTABLE_STATUSES: BookingStatus[] = [
    BookingStatus.ACCEPTED,
    BookingStatus.DECLINED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
];

export const isValidBookingStatusTransition = (
    currentStatus: BookingStatus,
    nextStatus: BookingStatus
): boolean => {
    return BOOKING_STATUS_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;
};
