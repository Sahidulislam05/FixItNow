import { BookingStatus } from "../../../generated/prisma/enums";
import { BookingWhereInput } from "../../../generated/prisma/models";

export interface ICreateBookingPayload {
    serviceId: string;
    scheduledDate: string | Date;
    address: string;
}

export interface IUpdateBookingStatusPayload {
    status: BookingStatus;
}

export interface ICancelBookingPayload {
    cancelReason?: string;
}

export interface IBookingQuery extends BookingWhereInput {
    status?: BookingStatus;
    page?: string;
    limit?: string;
}
