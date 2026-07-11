import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser } from "./auth.interface";

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email }
    })

    // ইচ্ছাকৃতভাবে "Invalid email or password" — generic message,
    // যাতে email exist করে কিনা সেটা বাইরে থেকে বোঝা না যায় (security best practice)
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    if (user.activeStatus === "BLOCKED") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact support.");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    };
}

const refreshToken = async (token: string) => {
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token not found. Please log in again.");
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(token, config.jwt_refresh_secret);

    if (!verifiedRefreshToken.success) {
        throw new AppError(httpStatus.UNAUTHORIZED, verifiedRefreshToken.error as string);
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
        where: { id }
    })

    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found. Please log in again.");
    }

    if (user.activeStatus === "BLOCKED") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact support.");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    return { accessToken }
}


export const authService = {
    loginUser,
    refreshToken
}
