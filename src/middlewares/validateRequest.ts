import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

// ============================================================
// নতুন সংযোজন — দুই zip এর কোনোটাতেই zod ছিল না, কিন্তু
// এসাইনমেন্টের মান্ডেটরি রিকোয়ারমেন্ট #4 (Input Validation)
// এর জন্য এই middleware লাগবে। ব্যবহার:
// router.post("/", validateRequest(someValidationSchema), controller)
// ============================================================
export const validateRequest = (schema: AnyZodObject) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        next();
    });
};
