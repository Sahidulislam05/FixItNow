import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IAdminUserQuery, IUpdateUserStatusPayload } from "./admin.interface";

const getAllUsersFromDB = async (query: IAdminUserQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const andConditions: UserWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: query.searchTerm, mode: "insensitive" } },
                { email: { contains: query.searchTerm, mode: "insensitive" } },
            ]
        });
    }

    if (query.role) {
        andConditions.push({ role: query.role });
    }

    if (query.activeStatus) {
        andConditions.push({ activeStatus: query.activeStatus });
    }

    const whereClause = andConditions.length ? { AND: andConditions } : undefined;

    const users = await prisma.user.findMany({
        where: whereClause,

        take: limit,
        skip: skip,

        orderBy: { createdAt: "desc" },

        omit: { password: true },

        include: { technicianProfile: true }
    });

    const total = await prisma.user.count({ where: whereClause });

    return {
        data: users,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }
}

// ban/unban — ADMIN নিজেকে বা অন্য কোনো ADMIN কে ব্লক করতে পারবে না
const updateUserStatusInDB = async (userId: string, payload: IUpdateUserStatusPayload) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });

    if (user.role === Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Admin account status can not be changed");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { activeStatus: payload.activeStatus },
        omit: { password: true }
    });

    return updatedUser;
}

export const adminService = {
    getAllUsersFromDB,
    updateUserStatusInDB
}
