import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}

// auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER)
// auth() => কোনো role restriction ছাড়া, শুধু valid login থাকলেই যথেষ্ট
export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken
            :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization?.split(" ")[1]
                : req.headers.authorization;

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in. Please log in to access this resource.");
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error as string);
        }

        const { email, name, id, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.FORBIDDEN, "Forbidden. You don't have permission to access this resource.");
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role
            }
        });

        if (!user) {
            throw new AppError(httpStatus.UNAUTHORIZED, "User not found. Please log in again.");
        }

        if (user.activeStatus === "BLOCKED") {
            throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact support.");
        }

        req.user = {
            email,
            name,
            id,
            role
        }

        next();

    }
    )
}
