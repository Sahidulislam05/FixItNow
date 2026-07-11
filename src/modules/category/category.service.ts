import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateCategoryPayload, IUpdateCategoryPayload } from "./category.interface";

const createCategoryIntoDB = async (payload: ICreateCategoryPayload) => {
    const existing = await prisma.category.findUnique({
        where: { name: payload.name }
    });

    if (existing) {
        throw new AppError(httpStatus.CONFLICT, "A category with this name already exists");
    }

    const category = await prisma.category.create({
        data: payload
    });

    return category;
}

const getAllCategoriesFromDB = async (searchTerm?: string) => {
    const categories = await prisma.category.findMany({
        where: searchTerm
            ? { name: { contains: searchTerm, mode: "insensitive" } }
            : undefined,
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { services: true }
            }
        }
    });

    return categories;
}

const getCategoryByIdFromDB = async (categoryId: string) => {
    const category = await prisma.category.findUniqueOrThrow({
        where: { id: categoryId },
        include: {
            _count: {
                select: { services: true }
            }
        }
    });

    return category;
}

const updateCategoryInDB = async (categoryId: string, payload: IUpdateCategoryPayload) => {
    await prisma.category.findUniqueOrThrow({
        where: { id: categoryId }
    });

    const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: payload
    });

    return updatedCategory;
}

export const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getCategoryByIdFromDB,
    updateCategoryInDB
}
