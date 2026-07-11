export interface ICreateReviewPayload {
    bookingId: string;
    rating: number;
    comment?: string;
}
