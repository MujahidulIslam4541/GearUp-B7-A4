import { prisma } from "../../lib"

const getAllUsers = async (page: string, limit: string) => {

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const result = await prisma.user.findMany({
        omit: {
            password: true
        },
        skip,
        take: limitNumber
    });

    const total = await prisma.user.count();

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            totalPage: Math.ceil(total / limitNumber)
        },
        data: result
    };
}

export const adminService = { getAllUsers }