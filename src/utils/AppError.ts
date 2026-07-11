// ============================================================
// নতুন সংযোজন (দুই zip এর কোনোটাতেই ছিল না):
// zip1 এ globalErrorHandler সবসময় generic Error/Prisma error
// এর উপর নির্ভর করে statusCode বের করত, তাই "not found",
// "unauthorized" এর মতো operational error গুলোতেও ভুল করে
// 500 রিটার্ন হতো। AppError দিয়ে service/middleware থেকে
// সরাসরি সঠিক statusCode সহ error থ্রো করা যাবে।
// ============================================================
export class AppError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
