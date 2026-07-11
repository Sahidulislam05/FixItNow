import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IRegisterUserPayload, IUpdateProfilePayload } from "./user.interface";

const registerUserIntoDB = async (payload: IRegisterUserPayload) => {
    const { name, email, password, phone, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    // role না দিলে ডিফল্ট CUSTOMER; TECHNICIAN হলে সাথে সাথে
    // একটা খালি TechnicianProfile তৈরি হয়ে যাবে, পরে
    // Day 2 এর technician module থেকে PUT /technician/profile
    // দিয়ে বিস্তারিত (bio, skills, experience) আপডেট করা যাবে।
    const finalRole = role === Role.TECHNICIAN ? Role.TECHNICIAN : Role.CUSTOMER;

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            role: finalRole,
            technicianProfile: finalRole === Role.TECHNICIAN ? { create: {} } : undefined,
        },
        omit: {
            password: true
        },
        include: {
            technicianProfile: true
        }
    });

    return createdUser;
}

const getMyProfileFromDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: {
            password: true
        },
        include: {
            technicianProfile: true
        }
    });

    return user;
}

// এখানে শুধু generic account info (name, phone) আপডেট হয়।
// Technician-specific ফিল্ড (bio, experienceYears, skills) এর জন্য
// আলাদা endpoint আছে -> PUT /api/technician/profile (Day 2, technician module)
const updateMyProfileInDB = async (userId: string, payload: IUpdateProfilePayload) => {
    const { name, phone } = payload;

    const updatedUser = await prisma.user.update({
        where: { id: userId },

        data: {
            name,
            phone,
        },

        omit: {
            password: true
        },

        include: {
            technicianProfile: true
        }
    })

    return updatedUser;
}

export const userService = {
    registerUserIntoDB,
    getMyProfileFromDB,
    updateMyProfileInDB
}
